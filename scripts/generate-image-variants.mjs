#!/usr/bin/env node
import * as clack from '@clack/prompts';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { basename, join, relative } from 'node:path';

class Cancelled extends Error {
	constructor() {
		super('Cancelled.');
	}
}

function checkCancel(value) {
	if (clack.isCancel(value)) throw new Cancelled();
	return value;
}

// One entry per size the site actually needs. Adding a size — a new purpose at an existing
// dimension, or a whole new dimension/ratio — is just a new row here; everything else (prompt
// groups, labels, output folders) is derived from this table.
const SIZES = [
	{ width: 960, height: 540, ratio: '16:9', purposes: ['post', 'category', 'tag'] },
	{ width: 1200, height: 630, ratio: '1.91:1', purposes: ['social'] },
];

function sizeLabel(size) {
	return `${size.width}x${size.height} — ${size.purposes.join(' / ')} cover`;
}

function sizeKey(size) {
	return `${size.width}x${size.height}`;
}

async function run(sourcePath) {
	clack.intro('image-variants');

	const source = await sharp(sourcePath)
		.metadata()
		.catch(() => {
			throw new Error(`'${sourcePath}' isn't a readable image.`);
		});
	clack.log.info(`Source: ${sourcePath} (${source.width}x${source.height})`);

	const groups = {};
	for (const size of SIZES) {
		(groups[size.ratio] ??= []).push({ value: sizeKey(size), label: sizeLabel(size) });
	}

	const selectedKeys = checkCancel(
		await clack.groupMultiselect({
			message: 'Which sizes do you need?',
			options: groups,
			required: true,
		}),
	);

	const fit = checkCancel(
		await clack.select({
			message: 'How should the photo fill each size?',
			options: [
				{ value: 'cover', label: 'Center-crop', hint: 'fills the exact size, cropping overflow' },
				{ value: 'contain', label: 'Fit inside', hint: 'keeps the whole photo, pads to fill' },
			],
		}),
	);

	const selected = SIZES.filter((size) => selectedKeys.includes(sizeKey(size)));
	const written = [];

	for (const size of selected) {
		const dir = join('public', sizeKey(size));
		await mkdir(dir, { recursive: true });
		const outPath = join(dir, basename(sourcePath));

		await sharp(sourcePath)
			.resize(size.width, size.height, {
				fit,
				position: 'centre',
				background: fit === 'contain' ? { r: 255, g: 255, b: 255, alpha: 1 } : undefined,
			})
			.toFile(outPath);

		written.push(outPath);
	}

	clack.outro(`Wrote ${written.map((path) => relative('.', path)).join(', ')}`);
}

const sourcePath = process.argv[2];
if (!sourcePath) {
	console.error('Usage: npm run image:variants -- <path-to-photo>');
	process.exit(1);
}

try {
	await run(sourcePath);
} catch (error) {
	if (error instanceof Cancelled) {
		clack.cancel('Cancelled — nothing was written.');
		process.exit(0);
	}
	console.error(`\nimage-variants: ${error.message}`);
	process.exit(1);
}
