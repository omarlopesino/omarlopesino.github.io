import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { writeFileLoaderEntry } from './file-loader-write.js';
import { getLoaderMeta, loadContentConfig } from './load-config.js';
import { inferGlobDestination } from './path-inference.js';
import { Cancelled, checkCancel, collectAnswers, prompts } from './prompts.js';
import { walkSchema } from './schema-walker.js';
import { fileExists, isMarkdownExtension, writeGlobEntry } from './write-entry.js';

function computeGeneratedId({ loaderMeta, answers, baseAbs }) {
	if (typeof loaderMeta.options.generateId !== 'function') {
		return answers.slug ?? answers.id ?? answers.cid ?? null;
	}
	try {
		return loaderMeta.options.generateId({
			entry: '',
			base: pathToFileURL(`${baseAbs}/`),
			data: answers,
		});
	} catch {
		return answers.slug ?? answers.id ?? answers.cid ?? null;
	}
}

async function collectFieldAnswers(def) {
	const warnings = [];
	const fields = walkSchema(def.schema, (fieldPath, type) => {
		warnings.push(`Unsupported schema node at '${fieldPath.join('.')}' (type: ${type}) — treated as free text.`);
	});
	const answers = await collectAnswers(fields);
	for (const warning of warnings) prompts.log.warn(warning);
	return answers;
}

async function confirmOrExit(message, initialValue) {
	const confirmed = checkCancel(await prompts.confirm({ message, initialValue }));
	if (!confirmed) {
		prompts.cancel('Cancelled — nothing was written.');
		process.exit(0);
	}
}

async function runGlobFlow({ projectRoot, def, loaderMeta }) {
	const answers = await collectFieldAnswers(def);

	const baseAbs = path.resolve(projectRoot, loaderMeta.options.base ?? '.');
	const generatedId = computeGeneratedId({ loaderMeta, answers, baseAbs });
	const destination = await inferGlobDestination({ projectRoot, loaderMeta, answers, generatedId });

	let extension = destination.extension;
	if (destination.needsExtensionChoice) {
		extension = checkCancel(
			await prompts.select({
				message: 'Which extension?',
				options: destination.extensionChoices.map((ext) => ({ value: ext, label: `.${ext}` })),
			}),
		);
	}

	let body = '';
	if (isMarkdownExtension(extension)) {
		body = checkCancel(
			await prompts.text({
				message: 'Body content (optional — you can also edit the file afterward)',
			}),
		);
	}

	const defaultAbsPath = path.join(destination.baseAbs, `${destination.relativePathWithoutExt}.${extension}`);
	const editedRelPath = checkCancel(
		await prompts.text({
			message: 'Destination path (edit if this looks wrong)',
			initialValue: path.relative(projectRoot, defaultAbsPath),
		}),
	);
	const absPath = path.resolve(projectRoot, editedRelPath);
	const displayPath = path.relative(projectRoot, absPath);

	if (await fileExists(absPath)) {
		await confirmOrExit(`${displayPath} already exists. Overwrite?`, false);
	} else {
		await confirmOrExit(`Write ${displayPath}?`, true);
	}

	await writeGlobEntry({ absPath, answers, body, extension });
	prompts.outro(`Wrote ${displayPath}`);
}

async function runFileFlow({ projectRoot, def, loaderMeta }) {
	const answers = await collectFieldAnswers(def);

	let id = answers.id ?? answers.slug;
	if (!id) {
		id = checkCancel(
			await prompts.text({
				message: `Entry id (this collection's schema has no "id"/"slug" field, so it can't be inferred)`,
				validate: (value) => (value ? undefined : 'Required.'),
			}),
		);
	}

	await confirmOrExit(`Add entry "${id}" to ${loaderMeta.fileName}?`, true);

	const absPath = await writeFileLoaderEntry({ projectRoot, fileName: loaderMeta.fileName, id, answers });
	prompts.outro(`Updated ${path.relative(projectRoot, absPath)}`);
}

export async function run({ cwd }) {
	const projectRoot = path.resolve(cwd);
	prompts.intro('astro-scaffold');

	try {
		const { collections } = await loadContentConfig(projectRoot);
		const names = Object.keys(collections);
		if (names.length === 0) {
			throw new Error('No collections found in the content config.');
		}

		const name = checkCancel(
			await prompts.select({
				message: 'Which content collection?',
				options: names.map((value) => ({ value, label: value })),
			}),
		);

		const def = collections[name];
		const loaderMeta = getLoaderMeta(def.loader);
		if (!loaderMeta) {
			throw new Error(`Collection "${name}" doesn't use the glob()/file() loaders astro-scaffold supports.`);
		}

		if (loaderMeta.kind === 'file') {
			await runFileFlow({ projectRoot, def, loaderMeta });
		} else {
			await runGlobFlow({ projectRoot, def, loaderMeta });
		}
	} catch (error) {
		if (error instanceof Cancelled) {
			prompts.cancel('Cancelled — nothing was written.');
			process.exit(0);
		}
		throw error;
	}
}
