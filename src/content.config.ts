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
    // GEO: drives FAQPage JSON-LD. Mirror the visible FAQ verbatim so the
    // structured data matches on-page content (Google requirement).
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    // GEO: entities this post is `about`, with authority links (official
    // sites) so search engines + LLMs tie the page to the right entities.
    entities: z.array(z.object({ name: z.string(), sameAs: z.string() })).optional(),
  }),
});

export const collections = { posts };
