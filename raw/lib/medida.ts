/**
 * raw no tiene hoja de estilos: lo único que decide cuánto mide una foto o una
 * cinta en pantalla son sus `width` y `height`. Aquí se sacan de la medida
 * nativa, a escala para que la pieza quepa entera en una pantalla de laptop.
 * En una ventana más angosta, `max-width: 100%` la encoge.
 */

/** La pieza abierta: una foto del rollo, una cinta. */
export const LAMINA = { ancho: 800, alto: 600 };

/** El cuadro de un índice. */
export const MINIATURA = { ancho: 240, alto: 240 };

/** Margen que el navegador le pone al `<body>` por defecto, de los dos lados. */
const MARGEN = 16;

/** `[ancho, alto]` a escala para caber en la caja. Nunca agranda. */
export const ajustar = (
  w: number,
  h: number,
  caja: { ancho: number; alto: number } = LAMINA
): [number, number] => {
  const k = Math.min(1, caja.ancho / w, caja.alto / h);
  return [Math.round(w * k), Math.round(h * k)];
};

/** El `sizes` de esa medida: a lo ancho de la ventana si no cabe, a su medida si cabe. */
export const sizesDe = (ancho: number): string =>
  `(max-width: ${ancho + MARGEN}px) calc(100vw - ${MARGEN}px), ${ancho}px`;
