/**
 * Las reglas de los derivados de imagen, sin datos: lo comparten el servidor
 * (`media.ts`, `Foto.astro`) y el JavaScript que arma imágenes en el navegador
 * (la lupa, los visores de von, dev, tube e ig). Aquí no se importa ningún JSON
 * a propósito: este archivo viaja al cliente.
 *
 * `resto` es lo que va después de `/media` en la ruta cruda:
 * `/media/projects/x/x-01.jpg` → `/projects/x/x-01.jpg`.
 */

/**
 * Respaldo en el formato del original, bajo su propio prefijo:
 * `/w800/posters/apice.webp`. Lo pide el `<img>` sólo si el navegador no
 * entiende AVIF.
 */
export const ANCHOS = [400, 800, 1600];

/**
 * Escalones de AVIF, que es lo que pinta casi todo navegador:
 * `/avif/w800/projects/x/x-01.avif`. Incluyen el ancho nativo, así que el
 * original pesado no se vuelve a pedir para pintar.
 *
 * Deshacer esto es borrar `avif/` del bucket y vaciar esta lista.
 */
export const ANCHOS_AVIF = [400, 640, 800, 1080, 1280, 1600, 1920, 2560];

/**
 * `srcset` de respaldo. Sólo ofrece derivados más chicos que el original (el
 * generador no escala hacia arriba, así que pedir uno más grande daría 404) y
 * cierra con el original a su ancho real.
 */
export const conjuntoRespaldo = (base: string, resto: string, ancho: number): string | undefined => {
  const chicos = ANCHOS.filter((w) => w < ancho).map((w) => `${base}/w${w}${resto} ${w}w`);
  return chicos.length ? [...chicos, `${base}${resto} ${ancho}w`].join(', ') : undefined;
};

/** `/projects/x/x-01.jpg` → `/projects/x/x-01.avif` */
const comoAvif = (resto: string) => resto.split('?')[0].replace(/\.\w+$/, '.avif');

/** URL de un escalón AVIF. */
export const urlAvif = (base: string, resto: string, w: number): string =>
  `${base}/avif/w${w}${comoAvif(resto)}`;

/** `srcset` AVIF: los escalones más chicos que el original y el ancho nativo. */
export const conjuntoAvif = (base: string, resto: string, ancho: number): string =>
  [...ANCHOS_AVIF.filter((w) => w < ancho), ancho]
    .map((w) => `${urlAvif(base, resto, w)} ${w}w`)
    .join(', ');

export interface Fuentes {
  src: string;
  srcset?: string;
  avif?: string;
  sizes: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  className?: string;
}

/**
 * El mismo `<picture>` que pinta `Foto.astro`, armado en el navegador.
 *
 * El orden importa: una `Image` empieza a bajar en cuanto recibe `src`, aunque
 * no esté en la página. Por eso el `<source>` y el `<img>` entran al
 * `<picture>` antes de que el `<img>` sepa qué pedir; si no, bajaría el
 * respaldo y luego el AVIF.
 */
export function armarFoto(f: Fuentes): { picture: HTMLPictureElement; img: HTMLImageElement } {
  const picture = document.createElement('picture');
  if (f.avif) {
    const source = document.createElement('source');
    source.type = 'image/avif';
    source.srcset = f.avif;
    source.sizes = f.sizes;
    picture.append(source);
  }

  const img = document.createElement('img');
  picture.append(img);
  img.alt = f.alt;
  if (f.className) img.className = f.className;
  if (f.width && f.height) {
    img.width = f.width;
    img.height = f.height;
  }
  img.decoding = 'async';
  if (f.loading) img.loading = f.loading;
  img.sizes = f.sizes;
  if (f.srcset) img.srcset = f.srcset;
  img.src = f.src;
  return { picture, img };
}
