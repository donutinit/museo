import { defineConfig } from 'astro/config';

/**
 * dev: el mismo archivo vendido como producto de software, en dev.vondiego.com.
 *
 * Tercer sitio dentro del mismo repo, con el mismo trato que von: sus páginas
 * viven en `dev/`, pero no tiene contenido propio. Lee los rollos de
 * `src/content/projects`, las cintas de `src/data/videos.ts`, la media a través
 * de `src/lib/media.ts` y los textos de `von/textos`.
 *
 *   npm run dev:dev
 *   npm run build:dev   → dist-dev/
 *
 * Sin sitemap a propósito: cada página apunta su canónico a la misma pieza en
 * www.vondiego.com, que es la que debe quedar en el índice.
 */
export default defineConfig({
  site: 'https://dev.vondiego.com',
  srcDir: './dev',
  publicDir: './dev/public',
  outDir: './dist-dev',
  cacheDir: './node_modules/.astro-dev',
  markdown: { syntaxHighlight: false },
});
