/**
 * Encerrar el foco dentro de una caja mientras está abierta.
 *
 * Sin esto, con Tab te sales del visor hacia la página de atrás y sigues
 * navegando algo que ya no se ve. Devuelve la función que suelta el encierro;
 * a quién le regresa el foco al cerrar lo decide quien llama.
 */
const ENFOCABLES = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** Los que de verdad se pueden enfocar ahora: los ocultos no cuentan. */
const enfocables = (caja: HTMLElement): HTMLElement[] =>
  Array.from(caja.querySelectorAll<HTMLElement>(ENFOCABLES)).filter(
    (el) => el.getClientRects().length > 0
  );

export function atrapar(caja: HTMLElement): () => void {
  const enCiclo = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focos = enfocables(caja);
    if (focos.length === 0) {
      e.preventDefault();
      return;
    }

    const primero = focos[0];
    const ultimo = focos[focos.length - 1];
    const activo = document.activeElement;
    const adentro = caja.contains(activo);

    if (e.shiftKey && (activo === primero || !adentro)) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && (activo === ultimo || !adentro)) {
      e.preventDefault();
      primero.focus();
    }
  };

  document.addEventListener('keydown', enCiclo, true);
  return () => document.removeEventListener('keydown', enCiclo, true);
}

/**
 * Saca de navegación y del árbol accesible todo lo que queda detrás de un
 * diálogo. Recorre cada nivel por si la caja no cuelga directamente de body.
 */
export function aislar(caja: HTMLElement): () => void {
  const estados = new Map<HTMLElement, boolean>();
  let rama: HTMLElement = caja;

  while (rama.parentElement) {
    const padre = rama.parentElement;
    Array.from(padre.children).forEach((hermano) => {
      if (!(hermano instanceof HTMLElement) || hermano === rama || hermano.tagName === 'SCRIPT') return;
      if (!estados.has(hermano)) estados.set(hermano, hermano.inert);
      hermano.inert = true;
    });
    if (padre === document.body) break;
    rama = padre;
  }

  return () => estados.forEach((estado, elemento) => { elemento.inert = estado; });
}
