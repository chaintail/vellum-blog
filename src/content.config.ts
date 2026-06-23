import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
    authors: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
  }),
});

export const collections = { posts };
