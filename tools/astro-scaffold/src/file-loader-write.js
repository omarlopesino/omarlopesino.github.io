import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// file()-loader collections hold every entry in one file (a JSON array of objects with an
// id/slug, or an object map keyed by id) rather than one file per entry, and have no
// generateId — so there's no path to infer, only an existing file to read, merge into, and
// rewrite. v1 only supports .json targets; .yaml/.toml would need a dependency to round-trip
// without a lossy rewrite, so those are left for the user to edit by hand.
export async function writeFileLoaderEntry({ projectRoot, fileName, id, answers }) {
	const ext = fileName.split('.').at(-1);
	const absPath = path.resolve(projectRoot, fileName);

	if (ext !== 'json') {
		throw new Error(
			`astro-scaffold doesn't support writing to file()-loader targets with a .${ext} extension yet — add this entry to ${fileName} by hand.`,
		);
	}

	let raw;
	try {
		raw = await readFile(absPath, 'utf8');
	} catch {
		raw = '{}';
	}

	let data;
	try {
		data = JSON.parse(raw);
	} catch {
		throw new Error(`${fileName} isn't valid JSON — fix it before scaffolding into it.`);
	}

	if (Array.isArray(data)) {
		const exists = data.some((item) => (item?.id ?? item?.slug)?.toString() === String(id));
		if (exists) throw new Error(`An entry with id "${id}" already exists in ${fileName}.`);
		data.push(answers);
	} else if (data && typeof data === 'object') {
		if (Object.hasOwn(data, id)) {
			throw new Error(`An entry with id "${id}" already exists in ${fileName}.`);
		}
		data[id] = answers;
	} else {
		throw new Error(`${fileName} must contain a JSON array or object to add entries to.`);
	}

	await writeFile(absPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
	return absPath;
}
