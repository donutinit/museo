import { existsSync, readFileSync } from 'node:fs';

/**
 * Los subtítulos viven una sola vez, en el `public/` del sitio principal.
 * von no los copia: los lee de ahí al compilar y los vuelve a emitir.
 */
const origen = (slug: string) => `./public/captions/${slug}.vtt`;

export const tieneSubtitulos = (slug: string): boolean => existsSync(origen(slug));

export const leerSubtitulos = (slug: string): string => readFileSync(origen(slug), 'utf8');
