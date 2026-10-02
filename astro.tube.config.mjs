import { defineConfig } from 'astro/config';

/**
 * tube: el mismo archivo con piel de sitio de videos, en tube.vondiego.com.
 *
 * Cuarto sitio dentro del mismo repo, con el mismo trato que von y dev: sus
 * páginas viven en `tube/`, pero no tiene contenido propio. Lee los rollos de
 * `src/content/projects`, las cintas de `src/data/videos.ts`, la media a través
 * de `src/lib/media.ts` y los textos de `von/textos`.
 *
 *   npm run dev:tube
 *   npm run build:tube   → dist-tube/
 *
 * Sin sitemap a propósito: cada página apunta su canónico a la misma pieza en
 * www.vondiego.com, que es la que debe quedar en el índice.
 */
export default defineConfig({
  site: 'https://tube.vondiego.com',
  srcDir: './tube',
  publicDir: './tube/public',
  outDir: './dist-tube',
  cacheDir: './node_modules/.astro-tube',
  markdown: { syntaxHighlight: false },
});
