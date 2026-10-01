import { defineConfig } from 'astro/config';

/**
 * von: el mismo archivo con piel de gitweb, servido en von.vondiego.com.
 *
 * Es un segundo sitio dentro del mismo repo. Sus páginas viven en `von/`, pero
 * no tiene contenido propio: lee los rollos de `src/content/projects`, las
 * cintas de `src/data/videos.ts` y la media a través de `src/lib/media.ts`.
 * Un rollo nuevo aparece en los dos sitios sin tocar nada aquí.
 *
 *   npm run dev:von
 *   npm run build:von   → dist-von/
 *
 * Sin sitemap a propósito: cada página apunta su canónico a la misma pieza en
 * www.vondiego.com, que es la que debe quedar en el índice.
 */
export default defineConfig({
  site: 'https://von.vondiego.com',
  srcDir: './von',
  publicDir: './von/public',
  outDir: './dist-von',
  cacheDir: './node_modules/.astro-von',
  // un bloque de código aquí es texto en gris, no un editor con tema
  markdown: { syntaxHighlight: false },
});
