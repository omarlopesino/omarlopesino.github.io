import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

// @todo evaluate if we can calculate language from path!
const taxonomyCollection =  (collectionName : string) => {
	return defineCollection({
		loader: glob({
			base: "./src/data", 
			pattern: collectionName + "/**/*.json",
			generateId: ({data}) => {
				// @todo use ID instead of slug.
				return data.id + '/' + data.language;
			},
		}),
		schema: z.object({
			name: z.string(),
			slug: z.string(),
			language: z.string(),
			id: z.string(),
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
		image: z.object({
            src: z.string(),
            alt: z.string(),
			width: z.int().default(960),
			height: z.int().default(540)
        }),
        category: reference('category'),
		tags: z.array(reference('tag')) ,
        recommended: z.optional(z.array(reference("blog"))),
	}),
});

export const collections = { category, tag, blog };
