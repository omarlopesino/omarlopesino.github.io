import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { writeMarkdownEntry } from './frontmatter.js';

const MARKDOWN_EXTENSIONS = new Set(['md', 'mdx']);

export async function fileExists(absPath) {
	try {
		await stat(absPath);
		return true;
	} catch {
		return false;
	}
}

// Writes a new glob()-loader entry at absPath: frontmatter + body for .md/.mdx, plain JSON for
// everything else (the data collections in this project's own content.config.ts are all .json).
export async function writeGlobEntry({ absPath, answers, body, extension }) {
	await mkdir(path.dirname(absPath), { recursive: true });

	const contents = MARKDOWN_EXTENSIONS.has(extension)
		? writeMarkdownEntry(answers, body)
		: `${JSON.stringify(answers, null, 2)}\n`;

	await writeFile(absPath, contents, 'utf8');
}

export function isMarkdownExtension(extension) {
	return MARKDOWN_EXTENSIONS.has(extension);
}
