// Minimal reimplementation of the astro:content virtual module's config-time surface.
// defineCollection() is astro's own identity/validation function (verified against
// node_modules/astro/dist/content/config.js, astro 7.2.9); reference() mirrors the union schema
// built by node_modules/astro/dist/content/runtime.js's reference(), so a schema field using it
// still walks as an ordinary Zod union instead of erroring at bundle/import time.
export const astroContentShimSource = `
import { z } from 'astro/zod';

export function defineCollection(config) {
	config.type ??= 'content';
	return config;
}

export function reference(collection) {
	return z.union([
		z.number().transform((num) => num.toString(10)),
		z.string(),
		z.object({ id: z.string(), collection: z.string() }),
		z.object({ slug: z.string(), collection: z.string() }),
	]).transform((lookup) => {
		if (typeof lookup === 'object') return lookup;
		return { id: lookup, collection };
	});
}
`;
