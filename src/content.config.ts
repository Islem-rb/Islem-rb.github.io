import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const schema = z.object({
  title: z.string(),
  summary: z.string(),
  // Short label from cv.md, e.g. "civic engagement platform".
  kind: z.string().optional(),
  stack: z.array(z.string()).min(1),
  // null = no public repository; the project page then shows no repo link.
  repo: z.url().nullable(),
  order: z.number().int(),
  // Year shown on the project card.
  year: z.string().regex(/^\d{4}$/),
  // Only set when cv.md says the project is still running.
  inProgress: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// English project pages (src/content/projects/*.md) and their French versions (projects/fr/*.md,
// same file names so /projects/x and /fr/projects/x pair up).
const projects = defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/projects' }), schema });
const projectsFr = defineCollection({ loader: glob({ pattern: '*.md', base: './src/content/projects/fr' }), schema });

export const collections = { projects, projectsFr };
