import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
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
    thumbnail: z.string(),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = { projects };
