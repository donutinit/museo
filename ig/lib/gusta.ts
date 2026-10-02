/**
 * "Me gusta" no cuenta nada ni avisa a nadie: se guarda en el navegador de
 * quien lo toca, que es lo único honesto que puede hacer un sitio estático.
 * Este módulo corre en el navegador; lo comparten las publicaciones y los reels.
 */
const LLAVE = 'vongram:gusta';

const leer = (): Set<string> => {
  try {
    return new Set(JSON.parse(localStorage.getItem(LLAVE) ?? '[]'));
  } catch {
    return new Set();
  }
};

const gusta = leer();

const guardar = () => {
  try {
    localStorage.setItem(LLAVE, JSON.stringify([...gusta]));
  } catch { /* sin almacenamiento, dura lo que dure la página */ }
};

export const leGusta = (slug: string) => gusta.has(slug);

/** Cambia el estado y devuelve cómo quedó. */
export const alternarGusta = (slug: string) => {
  if (gusta.has(slug)) gusta.delete(slug);
  else gusta.add(slug);
  guardar();
  return gusta.has(slug);
};

/** El doble toque sólo pone, nunca quita. */
export const darGusta = (slug: string) => {
  if (gusta.has(slug)) return;
  gusta.add(slug);
  guardar();
};
