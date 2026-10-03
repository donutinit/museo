import medidasJson from '../data/medidas.json';
import altJson from '../data/alt.json';
import { ANCHOS, ANCHOS_AVIF, conjuntoAvif, conjuntoRespaldo, urlAvif } from './foto';

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
 * Derivados que viven en R2 bajo su propio prefijo. Las reglas (qué anchos,
 * qué rutas) están en `foto.ts`, que también viaja al navegador.
 *
 * El original no se toca nunca. Deshacer esto es borrar `w400/`, `w800/`,
 * `w1600/` y `avif/` del bucket.
 */
export { ANCHOS, ANCHOS_AVIF };

/**
 * `srcset` de respaldo de una imagen del archivo, en su formato original. Si
 * no conocemos la medida, no se emite nada y se sirve el original.
 */
export const srcset = (path: string): string | undefined => {
  const medida = medidaDe(path);
  if (!medida || !path.startsWith('/media/')) return undefined;
  return conjuntoRespaldo(MEDIA_BASE, path.slice('/media'.length), medida[0]);
};

/**
 * `srcset` AVIF de una imagen del archivo, para el `<source>` de su
 * `<picture>`. Sin medida no hay derivados: nada que ofrecer.
 */
export const avifset = (path: string): string | undefined => {
  const medida = medidaDe(path);
  if (!medida || !path.startsWith('/media/')) return undefined;
  return conjuntoAvif(MEDIA_BASE, path.slice('/media'.length), medida[0]);
};

/** Un escalón AVIF suelto, p. ej. el fondo borroso de una lámina. */
export const avif = (path: string, w: number): string =>
  urlAvif(MEDIA_BASE, path.slice('/media'.length), w);

/**
 * Descripciones escritas a mano, mirando la foto. Las que faltan caen al
 * respaldo genérico — un `alt` de relleno describe menos que nada, pero al
 * menos nombra la pieza.
 */
const alts: Record<string, string> = altJson;

export const altDe = (path: string, respaldo: string): string =>
  alts[path.split('?')[0]] ?? respaldo;
