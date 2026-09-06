/**
 * Base de la media pesada.
 *
 * La media ya no se sirve desde el mismo origen que el sitio: vive en un
 * bucket R2 detrás de `media.vondiego.com`. Las rutas siguen escribiéndose
 * como `/media/...` en contenido y páginas; esta función las reescribe al
 * momento de render.
 *
 * Para apuntar a otro lado (p. ej. una copia local) exportá
 * `PUBLIC_MEDIA_BASE` antes de `astro build` o `astro dev`.
 */
export const MEDIA_BASE: string =
  import.meta.env.PUBLIC_MEDIA_BASE ?? 'https://media.vondiego.com';

/** `/media/videos/x.mp4` → `https://media.vondiego.com/videos/x.mp4` */
export const media = (path: string): string =>
  path.startsWith('/media/') ? MEDIA_BASE + path.slice('/media'.length) : path;
