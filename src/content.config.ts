import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['retrato', 'evento', 'comercial', 'personal', 'concierto']),
    year: z.number().int(),
    location: z.string().optional(),
    client: z.string().optional(),
    photoCount: z.number().int().positive(),
    photosDir: z.string(),
    photosPrefix: z.string(),
    poster: z.string(),
    /** Medida nativa del póster: de aquí sale el aspect del cuadro en la hoja. */
    posterWidth: z.number().int().positive(),
    posterHeight: z.number().int().positive(),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = { projects };
