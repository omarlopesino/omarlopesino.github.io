import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const typeImage = z.object({
	src: z.string(),
	alt: z.string(),
	width: z.int().default(960),
	height: z.int().default(540)
});

// Set only what should differ from the entry itself; everything left out is derived. Mirrors the
// Meta type in src/types.ts, which is what these end up in.
const typeSeo = z.optional(z.object({
	title: z.optional(z.string()),
	description: z.optional(z.string()),
	// A social card, for when the cover crops badly at 1.91:1.
	image: z.optional(typeImage),
	keywords: z.optional(z.array(z.string())),
	robots: z.optional(z.string()),
	// The original, when the post is published somewhere else first.
	canonical: z.optional(z.string()),
}));

// Every JSON collection is one file per language; the cid ties the translations together.
const dataLoader = (collectionName : string) => {
	return glob({
		base: "./src/data",
		pattern: collectionName + "/**/*.json",
		generateId: ({data}) => {
			return data.cid + '/' + data.language;
		},
	});
}

const translatable = {
	language: z.string(),
	cid: z.string(),
};

const taxonomyCollection =  (collectionName : string, imageRequired = true) => {
	return defineCollection({
		loader: dataLoader(collectionName),
		schema: z.object({
			name: z.string(),
			description: z.string(),
			// Categories always show a cover; a tag reads fine as text alone, so its image is optional.
			image: imageRequired ? typeImage : z.optional(typeImage),
			slug: z.string(),
			...translatable,
		}),
	});
}

// A dated record: a job, a qualification, and anything else shaped alike. Only education uses it.
const cvCollection = (collectionName : string) => {
	return defineCollection({
		loader: dataLoader(collectionName),
		schema: z.object({
			title: z.string(),
			organization: z.string(),
			startDate: z.string(),
			// Omitted means it is still current.
			endDate: z.optional(z.string()),
			summary: z.string(),
			// The summary carries the record; bullets are there for one that needs them.
			highlights: z.optional(z.array(z.string())),
			// A logo for the organization; the record reads fine without one.
			image: z.optional(typeImage),
			order: z.int(),
			...translatable,
		}),
	});
}

const category = taxonomyCollection('categories');

const tag = taxonomyCollection('tags', false);

const education = cvCollection('education');

// 'language' is the language this entry is written in; 'name' is the language it describes.
const spokenLanguage = defineCollection({
	loader: dataLoader('spoken-languages'),
	schema: z.object({
		name: z.string(),
		level: z.string(),
		order: z.int(),
		...translatable,
	}),
});

// One MDX file per language; the cid ties translations together, same as the taxonomy
// collections. There is no title/description/slug — the MDX body is the content itself, rendered
// directly wherever the embed is used.
const embed = defineCollection({
	loader: glob({
		base: './src/embeds',
		pattern: '**/*.{md,mdx}',
		generateId: ({data}) => {
			return data.cid + '/' + data.language;
		},
	}),
	schema: z.object({
		...translatable,
	}),
});

const blog = defineCollection({
  	loader: glob({ 
		base: './src/blog', 
		pattern: '**/*.{md,mdx}',
		generateId: ({data}) => {
			return data.slug + '/' + data.language;
		},
	}),
	schema: z.object({
        slug: z.string(),
		title: z.string(),
		description: z.string(),
		language: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.optional(z.coerce.date()),
		author: z.optional(z.string()),
		image: typeImage,
        // Bare cids, not entry ids — Astro's reference() validates against the full `cid/language`
        // id, which a bare cid never matches, so these stay plain strings and are resolved by hand
        // in src/lib/blog.ts.
        category: z.string(),
		tags: z.array(z.string()),
        recommended: z.optional(z.array(z.string())),
		cid: z.string(),
		seo: typeSeo
	}).transform((data) => ({
		...data,
		url: '/' + data.language + '/blog/' + data.slug,
	})),
});

export const collections = { category, tag, blog, education, spokenLanguage, embed };
