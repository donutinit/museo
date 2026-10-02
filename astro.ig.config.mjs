import { defineConfig } from 'astro/config';

/**
 * ig: el mismo archivo con piel de red social de fotos, en ig.vondiego.com.
 *
 * Quinto sitio dentro del mismo repo, con el mismo trato que von, dev y tube:
 * sus páginas viven en `ig/`, pero no tiene contenido propio. Lee los rollos
 * de `src/content/projects`, las cintas de `src/data/videos.ts`, la media a
 * través de `src/lib/media.ts` y los textos de `von/textos`.
 *
 *   npm run dev:ig
 *   npm run build:ig   → dist-ig/
 *
 * Sin sitemap a propósito: cada página apunta su canónico a la misma pieza en
 * www.vondiego.com, que es la que debe quedar en el índice.
 */
export default defineConfig({
  site: 'https://ig.vondiego.com',
  srcDir: './ig',
  publicDir: './ig/public',
  outDir: './dist-ig',
  cacheDir: './node_modules/.astro-ig',
  markdown: { syntaxHighlight: false },
});
