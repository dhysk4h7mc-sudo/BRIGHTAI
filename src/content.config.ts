import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    canonical: z.string().url(),
    pubDate: z.string(),
    updatedDate: z.string().optional(),
    author: z.string().optional(),
    slug: z.string(),
    readingTime: z.number().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

/**
 * Docs collection — same permissive pattern. Defined separately so the
 * prerender pipeline doesn't choke when both collections are present.
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(),
    canonical: z.string().url(),
    updated: z.coerce.date().optional(),
    category: z.string().optional(),
    tldr: z.string().optional(),
    related: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, docs };
