import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    // Short label from cv.md, e.g. "civic engagement platform".
    kind: z.string().optional(),
    stack: z.array(z.string()).min(1),
    // null = no public repository; the project page then shows no repo link.
    repo: z.url().nullable(),
    order: z.number().int(),
    // Year shown on the home timeline; the timeline is sorted on it, newest first.
    year: z.string().regex(/^\d{4}$/),
    // Only set when cv.md says the project is still running.
    inProgress: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
