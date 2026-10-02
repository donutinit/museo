/**
 * El archivo leído como perfil de una red social de fotos.
 *
 * Aquí no hay datos nuevos: todo sale de los rollos (`src/content/projects`) y
 * del catálogo de cintas (`src/data/videos.ts`). Lo único que hace este módulo
 * es nombrar cada cosa con el vocabulario de la red: un rollo es una
 * publicación en carrusel (y una historia), una cinta es un reel.
 *
 * Lo que no existe no se inventa: no hay seguidores, ni likes, ni comentarios.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { cintasPorFecha, kindLabel, type VideoEntry } from '../../src/data/videos';
import { oficio, medidaCinta } from '../../src/lib/archivo';
import { medidaDe, altDe } from '../../src/lib/media';
import { PERFILES } from '../../src/lib/seo';

export const SITIO = 'Vongram';
export const NOMBRE = 'Von Diego';
export const CORREO = 'contacto@vondiego.com';
export const SITIO_PRINCIPAL = 'https://www.vondiego.com';
export const REPO = 'https://github.com/donutinit/museo';

/** El perfil de verdad: a él manda el botón de seguir. */
export const INSTAGRAM = PERFILES.find((p) => p.includes('instagram.com')) ?? PERFILES[0];
/** `fotos.von.diego`, tal como está en Instagram. */
export const USUARIO = new URL(INSTAGRAM).pathname.replace(/\//g, '');

/** El mismo archivo con sus otras pieles. */
export const OTROS = [
  { href: SITIO_PRINCIPAL, nombre: 'www.vondiego.com', nota: 'Sala oscura' },
  { href: 'https://von.vondiego.com', nombre: 'von.vondiego.com', nota: 'Repositorio' },
  { href: 'https://dev.vondiego.com', nombre: 'dev.vondiego.com', nota: 'Software' },
  { href: 'https://tube.vondiego.com', nombre: 'tube.vondiego.com', nota: 'Videos' },
];

export type Clase = 'carrusel' | 'reel';

export interface Entrada {
  clase: Clase;
  slug: string;
  href: string;
  titulo: string;
  /** El oficio en minúsculas, como va en una etiqueta: `retrato`, `en vivo`. */
  oficio: string;
  fecha: Date;
  /** `2026-05-19`, para `<time datetime>`. */
  dia: string;
  /** `19 may 2026`: lo que se lee mientras no hay script que diga "3 sem". */
  diaCorto: string;
  lugar?: string;
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

/** `00:53` → `0:53`. */
export const corrida = (d: string) => d.replace(/^0(?=\d:)/, '');

/** `3 fotos`, `1 foto`. */
export const cuenta = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

const deRollo = (p: CollectionEntry<'projects'>): Entrada => ({
  clase: 'carrusel',
  slug: p.id,
  href: `/obra/${p.id}/`,
  titulo: p.data.title,
  oficio: oficio[p.data.type],
  fecha: p.data.publishedAt,
  dia: dia(p.data.publishedAt),
  diaCorto: corto.format(p.data.publishedAt),
  lugar: p.data.location,
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
    clase: 'reel',
    slug: v.slug,
    href: `/video/${v.slug}/`,
    titulo: v.title,
    oficio: kindLabel[v.kind].toLowerCase(),
    fecha,
    dia: dia(fecha),
    diaCorto: corto.format(fecha),
    poster: v.poster,
    pw,
    ph,
    texto: v.caption ?? '',
    cinta: v,
  };
};

/** Todo lo publicado, lo último primero. */
export async function publicaciones(): Promise<Entrada[]> {
  const rollos = await getCollection('projects');
  return [...rollos.map(deRollo), ...cintasPorFecha.map(deCinta)].sort(
    (a, b) => b.fecha.valueOf() - a.fecha.valueOf()
  );
}

/** Las fotos de un carrusel, en el orden del rollo. */
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

/** Los números del perfil: todos se pueden contar en el archivo. */
export const cuentas = (todo: Entrada[]) => ({
  publicaciones: todo.length,
  fotos: todo.reduce((n, e) => n + (e.rollo?.data.photoCount ?? 0), 0),
  reels: todo.filter((e) => e.clase === 'reel').length,
});

/**
 * El marco de una publicación. La red no deja nada más alto que 4:5 ni más
 * ancho que 1.91:1; adentro, cada foto va entera, sin recortar.
 */
export const marco = (razones: number[]): number =>
  Math.min(Math.max(Math.min(...razones), 4 / 5), 1.91);

/** `en vivo` → `envivo`: una etiqueta no lleva espacios. */
export const etiqueta = (t: string) => t.replace(/\s+/g, '');

/** Para comparar sin acentos ni mayúsculas: `Káren` se encuentra con `karen`. */
export const llano = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Lo que el buscador revisa de cada publicación. */
export const indice = (e: Entrada) =>
  llano(`${e.titulo} ${e.oficio} ${etiqueta(e.oficio)} ${e.clase} ${e.fecha.getUTCFullYear()} ${e.slug} ${e.texto}`);
