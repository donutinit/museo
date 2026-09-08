/**
 * El visor de fotos: un carrusel que se arrastra de lado, con puntitos abajo.
 *
 * Lo comparten la portada y las páginas de rollo, que sólo difieren en qué
 * fotos van juntas: en la portada el grupo es la placa; en un rollo, todo el
 * rollo.
 */
import { aislar, atrapar } from './foco';

export interface OpcionesLupa {
  /** Qué fotos se recorren a partir de la que se abrió. */
  grupoDe: (boton: HTMLButtonElement) => HTMLButtonElement[];
  alAbrir?: () => void;
  alCerrar?: () => void;
}

/** Arriba de esto los puntitos dejan de leerse y conviene la cuenta. */
const TOPE_DE_PUNTOS = 12;

export function montarLupa({ grupoDe, alAbrir, alCerrar }: OpcionesLupa): void {
  const visor = document.querySelector<HTMLElement>('[data-lupa-visor]');
  const carrusel = document.querySelector<HTMLElement>('[data-lupa-carrusel]');
  const puntos = document.querySelector<HTMLElement>('[data-lupa-puntos]');
  const pie = document.querySelector<HTMLElement>('[data-lupa-pie]');
  const anterior = document.querySelector<HTMLButtonElement>('[data-lupa-mover="-1"]');
  const siguiente = document.querySelector<HTMLButtonElement>('[data-lupa-mover="1"]');
  const disparadores = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-lupa-src]'));

  if (!visor || !carrusel || disparadores.length === 0) return;

  let grupo: HTMLButtonElement[] = [];
  let posicion = -1;
  let volverA: HTMLElement | null = null;
  let soltarFoco: (() => void) | null = null;
  let soltarAislamiento: (() => void) | null = null;
  let desbordeAnterior = '';

  const pintar = () => {
    puntos?.querySelectorAll<HTMLElement>('li').forEach((punto, i) => {
      punto.dataset.activo = String(i === posicion);
    });
    if (anterior) anterior.disabled = posicion <= 0;
    if (siguiente) siguiente.disabled = posicion >= grupo.length - 1;
    if (pie) pie.textContent = `${posicion + 1} de ${grupo.length}`;
  };

  /** Sólo la lámina que se abre carga de inmediato; el resto va perezosa. */
  const montar = (inicio: number) => {
    carrusel.replaceChildren(
      ...grupo.map((boton, i) => {
        const lamina = document.createElement('div');
        lamina.className = 'lupa-lamina';
        const img = document.createElement('img');
        img.src = boton.dataset.lupaSrc ?? '';
        img.alt = boton.dataset.lupaAlt ?? '';
        img.loading = i === inicio ? 'eager' : 'lazy';
        img.decoding = 'async';
        lamina.append(img);
        return lamina;
      })
    );
    puntos?.replaceChildren(...grupo.map(() => document.createElement('li')));
    visor.dataset.indicador = grupo.length <= TOPE_DE_PUNTOS ? 'puntos' : 'cuenta';
  };

  const irA = (i: number, suave: boolean) => {
    const lamina = carrusel.children[i] as HTMLElement | undefined;
    if (!lamina) return;
    carrusel.scrollTo({ left: lamina.offsetLeft, behavior: suave ? 'smooth' : 'auto' });
    posicion = i;
    pintar();
  };

  const mover = (paso: number) => {
    if (posicion < 0 || grupo.length === 0) return;
    const destino = Math.min(Math.max(posicion + paso, 0), grupo.length - 1);
    if (destino !== posicion) irA(destino, true);
  };

  // el dedo manda: al soltar, el indicador sigue a la lámina que quedó encuadrada
  let midiendo = 0;
  carrusel.addEventListener(
    'scroll',
    () => {
      if (midiendo) return;
      midiendo = window.requestAnimationFrame(() => {
        midiendo = 0;
        if (grupo.length === 0 || carrusel.clientWidth === 0) return;
        const i = Math.round(carrusel.scrollLeft / carrusel.clientWidth);
        if (i !== posicion && i >= 0 && i < grupo.length) {
          posicion = i;
          pintar();
        }
      });
    },
    { passive: true }
  );

  const abrir = (boton: HTMLButtonElement) => {
    grupo = grupoDe(boton);
    const inicio = grupo.indexOf(boton);
    if (inicio < 0) return;

    volverA = boton;
    alAbrir?.();
    // primero se muestra: el carrusel necesita ancho real para posicionarse
    visor.dataset.abierta = 'true';
    visor.setAttribute('aria-hidden', 'false');
    desbordeAnterior = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    soltarAislamiento = aislar(visor);
    montar(inicio);
    posicion = inicio;
    pintar();
    window.requestAnimationFrame(() => irA(inicio, false));
    soltarFoco = atrapar(visor);
    document.querySelector<HTMLButtonElement>('[data-lupa-cerrar]')?.focus();
  };

  const cerrar = () => {
    soltarFoco?.();
    soltarFoco = null;
    soltarAislamiento?.();
    soltarAislamiento = null;
    delete visor.dataset.abierta;
    visor.setAttribute('aria-hidden', 'true');
    carrusel.replaceChildren();
    puntos?.replaceChildren();
    posicion = -1;
    grupo = [];
    document.documentElement.style.overflow = desbordeAnterior;
    volverA?.focus();
    volverA = null;
    alCerrar?.();
  };

  disparadores.forEach((boton) => boton.addEventListener('click', () => abrir(boton)));
  document.querySelector('[data-lupa-cerrar]')?.addEventListener('click', cerrar);
  anterior?.addEventListener('click', () => mover(-1));
  siguiente?.addEventListener('click', () => mover(1));
  visor.addEventListener('click', (e) => { if (e.target === visor) cerrar(); });

  document.addEventListener('keydown', (e) => {
    if (posicion < 0) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
  });
}

/** Está abierta ahora mismo. */
export const lupaAbierta = (): boolean =>
  Boolean(document.querySelector('[data-lupa-visor][data-abierta="true"]'));
