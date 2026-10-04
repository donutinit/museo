import { defineConfig } from 'astro/config';

/**
 * raw: el mismo archivo sin piel, en raw.vondiego.com.
 *
 * Sexto sitio dentro del mismo repo, con el mismo trato que von, dev, tube e
 * ig: sus páginas viven en `raw/`, pero no tiene contenido propio. Lee los
 * rollos de `src/content/projects`, las cintas de `src/data/videos.ts`, la
 * media a través de `src/lib/media.ts` y los textos de `von/textos`.
 *
 * A diferencia de las otras pieles, no se disfraza de nada: son las rutas de
 * www con el HTML pelón, sin hoja de estilos, sin fuente y sin JavaScript.
 *
 *   npm run dev:raw
 *   npm run build:raw   → dist-raw/
 *
 * Sin sitemap a propósito: cada página apunta su canónico a la misma pieza en
 * www.vondiego.com, que es la que debe quedar en el índice.
 */
export default defineConfig({
  site: 'https://raw.vondiego.com',
  srcDir: './raw',
  publicDir: './raw/public',
  outDir: './dist-raw',
  cacheDir: './node_modules/.astro-raw',
  markdown: { syntaxHighlight: false },
});
