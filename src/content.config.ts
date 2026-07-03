import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const typeImage = z.object({
	src: z.string(),
	alt: z.string(),
	width: z.int().default(960),
	height: z.int().default(540)
});
// @todo evaluate if we can calculate language from path!
const taxonomyCollection =  (collectionName : string) => {
	return defineCollection({
		loader: glob({
			base: "./src/data", 
			pattern: collectionName + "/**/*.json",
			generateId: ({data}) => {
				console.log('generateid', data.cid + '/' + data.language);
				return data.cid + '/' + data.language;
			},
		}),
		schema: z.object({
			name: z.string(),
			description: z.string(),
			image: typeImage,
			slug: z.string(),
			language: z.string(),
			cid: z.string(),
		}),
	});
}

const category = taxonomyCollection('categories');

const tag = taxonomyCollection('tags');

const blog = defineCollection({
  	loader: glob({ 
		base: './src/blog', 
		pattern: '**/*.{md,mdx}',
		generateId: ({data}) => {
			// @todo use ID instead of slug.
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
	}),
});

export const collections = { category, tag, blog };
