import * as clack from '@clack/prompts';

class Cancelled extends Error {
	constructor() {
		super('Cancelled.');
	}
}

function checkCancel(value) {
	if (clack.isCancel(value)) {
		throw new Cancelled();
	}
	return value;
}

function setPath(target, path, value) {
	let node = target;
	for (let i = 0; i < path.length - 1; i++) {
		node[path[i]] ??= {};
		node = node[path[i]];
	}
	node[path[path.length - 1]] = value;
}

function formatDefault(field) {
	return field.hasDefault ? ` (default: ${JSON.stringify(field.defaultValue)})` : '';
}

async function promptText(field, { validate } = {}) {
	const message = `${field.label}${field.optional ? ' (optional, leave blank to skip)' : ''}${formatDefault(field)}`;
	const value = checkCancel(
		await clack.text({
			message,
			placeholder: field.hasDefault ? String(field.defaultValue) : undefined,
			validate: (input) => {
				// clack's TextPrompt passes the pre-submit value here, which is still undefined
				// (not '') when Enter is pressed without typing anything. Checking only for ''
				// let that slip past this check into a custom validator (e.g. the number/date
				// checks below), rejecting an untouched, blank, *optional* field; for a required
				// field it had the opposite effect — silently passing validation and then
				// resolving to an empty value that a required field should never get.
				if (input === '' || input === undefined) {
					return field.optional || field.hasDefault ? undefined : 'This field is required.';
				}
				return validate?.(input);
			},
		}),
	);
	return value;
}

async function promptOptionalGate(field) {
	if (!field.optional) return true;
	return checkCancel(
		await clack.confirm({
			message: `Include optional field '${field.label}'?`,
			initialValue: false,
		}),
	);
}

async function promptLeaf(field) {
	switch (field.kind) {
		case 'string':
		case 'record': {
			const raw = await promptText(field);
			if (raw === '') return undefined;
			if (field.kind === 'record') {
				try {
					return JSON.parse(raw);
				} catch {
					console.warn(`  (couldn't parse '${field.label}' as JSON — keeping the raw text)`);
					return raw;
				}
			}
			return raw;
		}

		case 'date': {
			const raw = await promptText(field, {
				validate: (input) => (Number.isNaN(Date.parse(input)) ? 'Enter a valid date.' : undefined),
			});
			return raw === '' ? undefined : raw;
		}

		case 'number': {
			const raw = await promptText(field, {
				validate: (input) => (Number.isFinite(Number(input)) ? undefined : 'Enter a number.'),
			});
			return raw === '' ? undefined : Number(raw);
		}

		case 'boolean': {
			const included = await promptOptionalGate(field);
			if (!included) return undefined;
			return checkCancel(
				await clack.confirm({ message: field.label, initialValue: Boolean(field.defaultValue) }),
			);
		}

		case 'enum': {
			const included = await promptOptionalGate(field);
			if (!included) return undefined;
			const options = field.options.map((value) => ({ value, label: String(value) }));
			return checkCancel(await clack.select({ message: field.label, options }));
		}

		default:
			return promptLeaf({ ...field, kind: 'string' });
	}
}

async function promptArray(field) {
	const included = await promptOptionalGate(field);
	if (!included) return undefined;

	const elementKind = field.element?.kind ?? 'string';
	const message = `${field.label} (comma-separated${elementKind === 'string' ? '' : `, ${elementKind}s`})`;
	const raw = checkCancel(await clack.text({ message, placeholder: 'a, b, c' }));
	const entries = raw
		.split(',')
		.map((entry) => entry.trim())
		.filter((entry) => entry.length > 0);

	if (entries.length === 0) return field.optional ? undefined : [];

	if (elementKind === 'number') return entries.map(Number);
	return entries;
}

async function promptObject(field) {
	const included = await promptOptionalGate(field);
	if (!included) return undefined;

	// Children carry their full absolute path from the schema root (e.g. ['seo', 'image', 'src']),
	// but they need to land in a plain local object here — relative to this group's own path —
	// which promptFieldInto's write step is then re-nested under by the caller.
	const answers = {};
	const offset = field.path.length;
	for (const child of field.children) {
		await promptFieldInto(answers, child, child.path.slice(offset));
	}
	return answers;
}

async function promptFieldInto(target, field, relativePath = field.path) {
	let value;
	if (field.kind === 'array') {
		value = await promptArray(field);
	} else if (field.kind === 'object') {
		value = await promptObject(field);
	} else {
		value = await promptLeaf(field);
	}
	if (value !== undefined) {
		setPath(target, relativePath, value);
	}
}

// Runs one prompt per PromptField (nested object/array fields recurse), returning a nested
// answers object with skipped optional fields simply absent. Cancellation propagates as
// Cancelled — the caller decides how to report it.
export async function collectAnswers(fields) {
	const answers = {};
	for (const field of fields) {
		await promptFieldInto(answers, field);
	}
	return answers;
}

export { checkCancel, Cancelled };
export const prompts = clack;
