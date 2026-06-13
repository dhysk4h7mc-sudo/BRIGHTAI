import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string(),
    description: z.string(),
    canonical: z.string().url(),
    updated: z.coerce.date(),
    category: z.enum(['Kernel', 'PDPL', 'NCA', 'SDAIA', 'General']),
    tldr: z.string(),
    related: z.array(z.string()),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    canonical: z.string().url(),
    pubDate: z.string(),
    updatedDate: z.string(),
    author: z.string(),
    slug: z.string(),
    readingTime: z.number(),
  }),
});

export const collections = { docs, blog };
