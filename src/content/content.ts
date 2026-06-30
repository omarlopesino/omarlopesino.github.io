import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
        slug: z.string(),
		description: z.string(),
		language: z.string(),
		pubDate: z.coerce.date(),
		image: z.object({
            url: z.string(),
            alt: z.string(),
        }),
        category: z.string(),
		tags: z.array(z.string()) ,
        recomme3nded: z.array(reference("content")),
	}),
});

export const collections = {
  'blog': blog
};
