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
    // null = exact repository URL not in cv.md yet; rendered as a visible TODO.
    repo: z.url().nullable(),
    order: z.number().int(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects };
