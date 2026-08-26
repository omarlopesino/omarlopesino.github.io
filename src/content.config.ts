import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const typeImage = z.object({
	src: z.string(),
	alt: z.string(),
	width: z.int().default(960),
	height: z.int().default(540)
});

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

const taxonomyCollection =  (collectionName : string) => {
	return defineCollection({
		loader: dataLoader(collectionName),
		schema: z.object({
			name: z.string(),
			description: z.string(),
			image: typeImage,
			slug: z.string(),
			...translatable,
		}),
	});
}

// A dated record on the about-me timeline: a job, a qualification, and anything else shaped alike.
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

const tag = taxonomyCollection('tags');

const experience = cvCollection('experience');

const education = cvCollection('education');

const skill = defineCollection({
	loader: dataLoader('skills'),
	schema: z.object({
		name: z.string(),
		description: z.string(),
		// A stable id, never translated text, so grouping holds across languages.
		group: z.enum(['backend', 'frontend', 'data', 'devops', 'practice']),
		order: z.int(),
		...translatable,
	}),
});

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
		image: typeImage,
        category: reference('category'),
		tags: z.array(reference('tag')) ,
        recommended: z.optional(z.array(reference("blog"))),
		cid: z.string()
	}).transform((data) => ({
		...data,
		url: '/' + data.language + '/blog/' + data.slug,
	})),
});

export const collections = { category, tag, blog, experience, education, skill, spokenLanguage };
