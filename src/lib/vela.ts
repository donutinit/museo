/**
 * Que la pantalla no se apague mientras corre una cinta.
 *
 * La Wake Lock API pide el candado al navegador; si no la tiene o dice que
 * no, no pasa nada y la pantalla se apaga como siempre. Al ocultar la
 * pestaña el navegador devuelve el candado solo, así que se vuelve a pedir
 * cuando reaparece y sigue habiendo video corriendo.
 */

let candado: WakeLockSentinel | null = null;
let prendida = false;

const pedir = async () => {
  if (candado || !prendida) return;
  if (!('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
  try {
    candado = await navigator.wakeLock.request('screen');
    candado.addEventListener('release', () => { candado = null; });
  } catch { /* el navegador dijo que no */ }
};

/** La pantalla no se apaga hasta nuevo aviso. */
export const velar = () => {
  prendida = true;
  void pedir();
};

/** Ya se puede apagar otra vez. */
export const dormir = () => {
  prendida = false;
  candado?.release().catch(() => {});
  candado = null;
};

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') void pedir();
});
