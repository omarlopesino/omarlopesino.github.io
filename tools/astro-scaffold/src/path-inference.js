import { glob, readFile } from 'node:fs/promises';
import path from 'node:path';
import { flattenScalars, parseFrontmatterYaml, splitFrontmatter } from './frontmatter.js';

function parseExtensions(pattern) {
	const patterns = Array.isArray(pattern) ? pattern : [pattern];
	const extensions = new Set();
	for (const single of patterns) {
		const braceMatch = single.match(/\{([^}]+)\}(?!.*\{)/);
		if (braceMatch) {
			for (const part of braceMatch[1].split(',')) {
				const trimmed = part.trim().replace(/^\./, '');
				if (trimmed) extensions.add(trimmed);
			}
			continue;
		}
		const extMatch = single.match(/\.([A-Za-z0-9]+)$/);
		if (extMatch) extensions.add(extMatch[1]);
	}
	return [...extensions];
}

async function parseEntryData(absoluteFile) {
	const raw = await readFile(absoluteFile, 'utf8');
	if (absoluteFile.endsWith('.json')) {
		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	}
	const { data } = splitFrontmatter(raw);
	if (data === null) return null;
	return parseFrontmatterYaml(data);
}

// Learns a project's own directory-nesting convention for a collection (e.g. "<language>/<slug>")
// by diffing existing sibling files' path segments against their own frontmatter/JSON field
// values, rather than assuming any particular layout.
async function inferTemplate(baseAbs, pattern) {
	const files = [];
	for await (const relativeFile of glob(pattern, { cwd: baseAbs })) {
		files.push(relativeFile.split(path.sep).join('/'));
	}

	const bySegmentCount = new Map();
	for (const relativeFile of files) {
		const withoutExt = relativeFile.replace(/\.[^/.]+$/, '');
		const segments = withoutExt.split('/');
		if (!bySegmentCount.has(segments.length)) bySegmentCount.set(segments.length, []);
		bySegmentCount.get(segments.length).push({ relativeFile, segments });
	}

	if (bySegmentCount.size === 0) return { template: null, sampleCount: 0 };

	// Vote among files sharing the most common segment count, since a project could have a few
	// stray/legacy files that don't fit the dominant layout.
	const [, samples] = [...bySegmentCount.entries()].sort((a, b) => b[1].length - a[1].length)[0];

	const segmentCount = samples[0].segments.length;
	const votes = Array.from({ length: segmentCount }, () => new Map());

	for (const sample of samples) {
		const data = await parseEntryData(path.join(baseAbs, sample.relativeFile));
		if (!data) continue;
		const scalars = flattenScalars(data);
		for (let i = 0; i < segmentCount; i++) {
			const segment = sample.segments[i];
			let matchedField = null;
			for (const [field, value] of scalars) {
				if (String(value) === segment) {
					matchedField = field;
					break;
				}
			}
			const key = matchedField ? `field:${matchedField}` : `literal:${segment}`;
			const bucket = votes[i];
			bucket.set(key, (bucket.get(key) ?? 0) + 1);
		}
	}

	const template = votes.map((bucket) => {
		const [winner] = [...bucket.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
		if (!winner) return null;
		if (winner.startsWith('field:')) return { type: 'field', field: winner.slice('field:'.length) };
		return { type: 'literal', value: winner.slice('literal:'.length) };
	});

	const extensionCounts = new Map();
	for (const sample of samples) {
		const ext = sample.relativeFile.match(/\.([A-Za-z0-9]+)$/)?.[1];
		if (ext) extensionCounts.set(ext, (extensionCounts.get(ext) ?? 0) + 1);
	}
	const [dominantExtension] = [...extensionCounts.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];

	if (template.some((segment) => segment === null)) {
		return { template: null, sampleCount: samples.length, dominantExtension };
	}
	return { template, sampleCount: samples.length, dominantExtension };
}

// A single rendered path segment must never itself contain a path separator — otherwise a
// fallback value (e.g. a composite generateId like "my-post/en") would silently create nested
// directories instead of the single segment it was meant to fill in.
function sanitizeSegment(value) {
	return String(value).replace(/[\\/]+/g, '-');
}

// Prefers a plain identifying field over the collection's own (possibly composite, slash-joined)
// generateId output, so a fresh/empty collection's first entry doesn't get nested under a folder
// named after its own filename.
function fallbackId(answers, generatedId) {
	return answers.slug ?? answers.id ?? answers.cid ?? generatedId ?? 'untitled';
}

function lookupField(answers, fieldPath) {
	const parts = fieldPath.split('.');
	let node = answers;
	for (const part of parts) {
		if (node == null || typeof node !== 'object') return undefined;
		node = node[part];
	}
	return node;
}

// Computes a destination for a glob()-loader collection: infers the existing on-disk convention
// from sibling files, then renders it against the new entry's answers. Always returns a result the
// caller shows to the user for confirmation/edit before writing — this never writes anything.
export async function inferGlobDestination({ projectRoot, loaderMeta, answers, generatedId }) {
	const { base = '.', pattern } = loaderMeta.options;
	const baseAbs = path.resolve(projectRoot, base);
	const extensions = parseExtensions(pattern);

	const { template, dominantExtension } = await inferTemplate(baseAbs, pattern);

	let relativePath;
	if (template) {
		const rendered = template.map((segment) => {
			if (segment.type === 'literal') return sanitizeSegment(segment.value);
			const value = lookupField(answers, segment.field);
			return sanitizeSegment(value !== undefined ? value : fallbackId(answers, generatedId));
		});
		relativePath = rendered.join('/');
	} else {
		relativePath = sanitizeSegment(fallbackId(answers, generatedId));
	}

	// If existing siblings agree on an extension, use it silently; otherwise (including an empty
	// collection) the caller must ask.
	const extension = dominantExtension ?? extensions[0];
	const needsExtensionChoice = !dominantExtension && extensions.length > 1;

	return {
		baseAbs,
		relativePathWithoutExt: relativePath,
		extensionChoices: extensions.length > 0 ? extensions : ['mdx'],
		extension,
		needsExtensionChoice,
	};
}
