/**
 * Compartir un enlace: la hoja del sistema donde la hay y, si no, el
 * portapapeles con un aviso. Corre en el navegador.
 */
let reloj = 0;

const avisar = (mensaje: string) => {
  const tostada = document.querySelector<HTMLElement>('[data-tostada]');
  if (!tostada) return;
  tostada.textContent = mensaje;
  tostada.hidden = false;
  clearTimeout(reloj);
  reloj = window.setTimeout(() => { tostada.hidden = true; }, 3000);
};

export const puedeCompartir = () => Boolean(navigator.share || navigator.clipboard);

export async function compartir(url: string) {
  try {
    if (navigator.share) await navigator.share({ title: document.title, url });
    else {
      await navigator.clipboard.writeText(url);
      avisar('Enlace copiado');
    }
  } catch (error) {
    // cerrar la hoja de compartir no es un error
    if (error instanceof DOMException && error.name === 'AbortError') return;
    avisar('No se pudo copiar el enlace');
  }
}
