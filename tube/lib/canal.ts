/**
 * El archivo leído como canal de videos.
 *
 * Aquí no hay datos nuevos: todo sale de los rollos (`src/content/projects`) y
 * del catálogo de cintas (`src/data/videos.ts`). Lo único que hace este módulo
 * es nombrar cada cosa con el vocabulario de un sitio de videos: una cinta
 * apaisada es un video, una cinta vertical es un short y un rollo es una
 * playlist de fotos.
 *
 * Lo que no existe no se inventa: no hay vistas, ni likes, ni suscriptores.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { cintasPorFecha, kindLabel, type VideoEntry } from '../../src/data/videos';
import { oficio, medidaCinta } from '../../src/lib/archivo';
import { medidaDe, altDe } from '../../src/lib/media';
import { PERFILES } from '../../src/lib/seo';

export const CANAL = 'Von Diego';
export const SITIO = 'VonTube';
export const CORREO = 'contacto@vondiego.com';
export const SITIO_PRINCIPAL = 'https://www.vondiego.com';
export const SITIO_VON = 'https://von.vondiego.com';
export const SITIO_DEV = 'https://dev.vondiego.com';
export const REPO = 'https://github.com/donutinit/museo';

/** El canal de verdad: a él manda el botón de suscribirse. */
export const YOUTUBE = PERFILES.find((p) => p.includes('youtube.com')) ?? PERFILES[0];
/** `@vondiegoa`, tal como está en YouTube. */
export const ARROBA = new URL(YOUTUBE).pathname.replace(/^\//, '');

export type Clase = 'video' | 'short' | 'playlist';

export interface Entrada {
  clase: Clase;
  slug: string;
  href: string;
  titulo: string;
  /** El oficio, con mayúscula: `Entrevista`, `Retrato`, `En vivo`. */
  oficio: string;
  fecha: Date;
  /** `2026-05-19`, para `<time datetime>`. */
  dia: string;
  /** `19 may 2026`: lo que se lee mientras no hay script que diga "hace 4 meses". */
  diaCorto: string;
  /** Lo que va en la esquina de la miniatura: `0:53` o `12 fotos`. */
  insignia: string;
  poster: string;
  pw: number;
  ph: number;
  /** Texto que el buscador puede encontrar además del título. */
  texto: string;
  rollo?: CollectionEntry<'projects'>;
  cinta?: VideoEntry;
}

export interface Pieza {
  /** `03` */
  nn: string;
  /** `apice-03.jpg` */
  archivo: string;
  /** `/media/projects/apice/apice-03.jpg`, crudo: falta pasarlo por `media()`. */
  ruta: string;
  w?: number;
  h?: number;
  alt: string;
}

const dia = (f: Date) => f.toISOString().slice(0, 10);

const corto = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** `00:53` → `0:53`. */
export const corrida = (d: string) => d.replace(/^0(?=\d:)/, '');

/** `3 fotos`, `1 foto`. */
export const cuenta = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

const deRollo = (p: CollectionEntry<'projects'>): Entrada => ({
  clase: 'playlist',
  slug: p.id,
  href: `/obra/${p.id}/`,
  titulo: p.data.title,
  oficio: mayuscula(oficio[p.data.type]),
  fecha: p.data.publishedAt,
  dia: dia(p.data.publishedAt),
  diaCorto: corto.format(p.data.publishedAt),
  insignia: cuenta(p.data.photoCount, 'foto', 'fotos'),
  poster: p.data.poster,
  pw: p.data.posterWidth,
  ph: p.data.posterHeight,
  texto: [p.data.location, p.data.client, p.body].filter(Boolean).join(' '),
  rollo: p,
});

const deCinta = (v: VideoEntry): Entrada => {
  const fecha = new Date(v.recordedAt);
  const [pw, ph] = medidaDe(v.poster) ?? medidaCinta(v.aspect);
  return {
    // una cinta parada es un short; las demás, videos
    clase: v.aspect === '9/16' ? 'short' : 'video',
    slug: v.slug,
    href: `/video/${v.slug}/`,
    titulo: v.title,
    oficio: kindLabel[v.kind],
    fecha,
    dia: dia(fecha),
    diaCorto: corto.format(fecha),
    insignia: corrida(v.durationLabel),
    poster: v.poster,
    pw,
    ph,
    texto: v.caption ?? '',
    cinta: v,
  };
};

/** Todo lo que subió el canal, lo último primero. */
export async function canal(): Promise<Entrada[]> {
  const rollos = await getCollection('projects');
  return [...rollos.map(deRollo), ...cintasPorFecha.map(deCinta)].sort(
    (a, b) => b.fecha.valueOf() - a.fecha.valueOf()
  );
}

export const deClase = (todo: Entrada[], clase: Clase) => todo.filter((e) => e.clase === clase);

/** Las fotos de una playlist, en el orden del rollo. */
export const piezasDe = (p: CollectionEntry<'projects'>): Pieza[] =>
  Array.from({ length: p.data.photoCount }, (_, i) => {
    const nn = String(i + 1).padStart(2, '0');
    const archivo = `${p.data.photosPrefix}-${nn}.jpg`;
    const ruta = `${p.data.photosDir}${archivo}`;
    const medida = medidaDe(ruta);
    return {
      nn,
      archivo,
      ruta,
      w: medida?.[0],
      h: medida?.[1],
      alt: altDe(ruta, `${p.data.title}, pieza ${i + 1}`),
    };
  });

/** Los oficios que hay, para las fichas de filtro, en orden de aparición. */
export const oficios = (todo: Entrada[]) => [...new Set(todo.map((e) => e.oficio))];

/** Para comparar sin acentos ni mayúsculas: `Káren` se encuentra con `karen`. */
export const llano = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
