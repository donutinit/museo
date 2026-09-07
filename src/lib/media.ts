import medidasJson from '../data/medidas.json';

/**
 * Base de la media pesada.
 *
 * La media no se sirve desde el mismo origen que el sitio: vive en un bucket R2
 * detrás de `media.vondiego.com`. Las rutas siguen escribiéndose como
 * `/media/...` en contenido y páginas; esta función las reescribe al render.
 *
 * Para apuntar a otro lado (p. ej. una copia local) exportá `PUBLIC_MEDIA_BASE`
 * antes de `astro build` o `astro dev`.
 */
export const MEDIA_BASE: string =
  import.meta.env.PUBLIC_MEDIA_BASE ?? 'https://media.vondiego.com';

/** `/media/videos/x.mp4` → `https://media.vondiego.com/videos/x.mp4` */
export const media = (path: string): string =>
  path.startsWith('/media/') ? MEDIA_BASE + path.slice('/media'.length) : path;

/**
 * Medidas nativas de cada imagen, generadas por `node scripts/derivados.mjs`
 * a partir de los originales. Sirven para dos cosas: emitir `width`/`height`
 * (que reservan el espacio y matan el salto de layout) y saber hasta dónde
 * tiene sentido ofrecer un derivado.
 */
const medidas: Record<string, number[]> = medidasJson;

/** `[ancho, alto]` del original, si lo conocemos. */
export const medidaDe = (path: string): [number, number] | undefined => {
  const m = medidas[path.split('?')[0]];
  return m && m.length === 2 ? [m[0], m[1]] : undefined;
};

/**
 * Anchos de los derivados que viven en R2 bajo su propio prefijo:
 * `/media/posters/apice.webp` → `https://media.vondiego.com/w800/posters/apice.webp`.
 *
 * El original no se toca nunca. Deshacer esto es borrar `w400/`, `w800/` y
 * `w1600/` del bucket y vaciar esta lista.
 */
export const ANCHOS = [400, 800, 1600];

/**
 * `srcset` de una imagen del archivo. Sólo ofrece derivados más chicos que el
 * original — el generador no escala hacia arriba, así que pedir uno más grande
 * daría 404 — y cierra con el original a su ancho real, que es el tope de
 * verdad. Si no conocemos la medida, no se emite nada y se sirve el original.
 */
export const srcset = (path: string): string | undefined => {
  const medida = medidaDe(path);
  if (!medida || !path.startsWith('/media/')) return undefined;

  const [ancho] = medida;
  const resto = path.slice('/media'.length);
  const candidatos = ANCHOS.filter((w) => w < ancho).map(
    (w) => `${MEDIA_BASE}/w${w}${resto} ${w}w`
  );
  if (candidatos.length === 0) return undefined;

  return [...candidatos, `${MEDIA_BASE}${resto} ${ancho}w`].join(', ');
};
