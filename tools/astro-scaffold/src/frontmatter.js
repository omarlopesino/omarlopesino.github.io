// A small, deliberately narrow YAML-frontmatter reader/writer. We only ever need to (a) write
// frontmatter our own tool produced, and (b) read that same simple subset back from sibling files
// during path-inference's convention scan — never arbitrary hand-authored YAML (anchors,
// multiline blocks, comments-with-semantics, flow-style objects). A sibling file that doesn't fit
// this subset is meant to be skipped by the caller, not treated as a hard error.

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function splitFrontmatter(raw) {
	const match = raw.match(FRONTMATTER_RE);
	if (!match) return { data: null, body: raw };
	return { data: match[1], body: match[2] };
}

function parseScalar(raw) {
	if (raw.startsWith('[') || raw.startsWith('{')) {
		try {
			return JSON.parse(raw);
		} catch {
			return raw;
		}
	}
	if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
		return raw.slice(1, -1);
	}
	if (raw === 'true') return true;
	if (raw === 'false') return false;
	if (raw !== '' && !Number.isNaN(Number(raw))) return Number(raw);
	return raw;
}

// Indentation-based, one key-per-line reader. Returns null (rather than throwing) on anything it
// can't make sense of, so a caller scanning many sibling files can skip a bad one and keep going.
export function parseFrontmatterYaml(text) {
	try {
		const lines = text.split('\n').filter((line) => line.trim() !== '' && !line.trim().startsWith('#'));
		const root = {};
		const stack = [{ indent: -1, obj: root }];
		for (const rawLine of lines) {
			const indent = rawLine.match(/^ */)[0].length;
			const line = rawLine.trim();
			const colonIndex = line.indexOf(':');
			if (colonIndex === -1) continue;
			const key = line.slice(0, colonIndex).trim();
			const valueStr = line.slice(colonIndex + 1).trim();
			while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
			const parent = stack[stack.length - 1].obj;
			if (valueStr === '') {
				const child = {};
				parent[key] = child;
				stack.push({ indent, obj: child });
			} else {
				parent[key] = parseScalar(valueStr);
			}
		}
		return root;
	} catch {
		return null;
	}
}

export function flattenScalars(obj, prefix = []) {
	const result = new Map();
	if (!obj || typeof obj !== 'object') return result;
	for (const [key, value] of Object.entries(obj)) {
		const path = [...prefix, key];
		if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
			for (const [k, v] of flattenScalars(value, path)) result.set(k, v);
		} else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			result.set(path.join('.'), value);
		}
	}
	return result;
}

function yamlValue(value, indent) {
	if (value === null || value === undefined) return 'null';
	if (typeof value === 'number' || typeof value === 'boolean') return String(value);
	if (typeof value === 'string') return JSON.stringify(value);
	if (Array.isArray(value)) return `[${value.map((entry) => yamlValue(entry, indent)).join(', ')}]`;
	if (typeof value === 'object') {
		const lines = [];
		for (const [key, entry] of Object.entries(value)) {
			if (entry === undefined) continue;
			if (entry !== null && typeof entry === 'object' && !Array.isArray(entry)) {
				lines.push(`${' '.repeat(indent)}${key}:`);
				lines.push(yamlValue(entry, indent + 2));
			} else {
				lines.push(`${' '.repeat(indent)}${key}: ${yamlValue(entry, indent)}`);
			}
		}
		return lines.join('\n');
	}
	return JSON.stringify(value);
}

export function serializeFrontmatter(data) {
	return yamlValue(data, 0);
}

export function writeMarkdownEntry(data, body) {
	return `---\n${serializeFrontmatter(data)}\n---\n\n${body ?? ''}\n`;
}
