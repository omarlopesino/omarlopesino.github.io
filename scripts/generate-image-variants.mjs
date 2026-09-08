#!/usr/bin/env node
import * as clack from '@clack/prompts';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { basename, extname, join, relative } from 'node:path';

// AVIF's quality scale isn't comparable to JPEG's — 50 is sharp's own default and the commonly
// recommended value for photographic content, visually close to JPEG at ~75-80.
const AVIF_QUALITY = 50;

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
//
// The 16:9 pair is a @1x/@2x set: post/category/tag covers are never shown past double their own
// folder name, so `coverSrcSet()` (src/lib/images.ts) builds the `srcset` by halving the large
// path's own folder name, not a lookup table. Pick both sizes when generating a new one of these,
// or the srcset it renders 404s on the half it's missing.
const SIZES = [
	{ width: 960, height: 540, ratio: '16:9', purposes: ['post', 'category', 'tag'], note: '@2x' },
	{ width: 480, height: 270, ratio: '16:9', purposes: ['post', 'category', 'tag'], note: '@1x' },
	{ width: 1200, height: 630, ratio: '1.91:1', purposes: ['social'] },
];

function sizeLabel(size) {
	const suffix = size.note ? ` (${size.note})` : '';
	return `${size.width}x${size.height} — ${size.purposes.join(' / ')} cover${suffix}`;
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
		const name = basename(sourcePath, extname(sourcePath));
		const outPath = join(dir, `${name}.avif`);

		await sharp(sourcePath)
			.resize(size.width, size.height, {
				fit,
				position: 'centre',
				background: fit === 'contain' ? { r: 255, g: 255, b: 255, alpha: 1 } : undefined,
			})
			.avif({ quality: AVIF_QUALITY })
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
