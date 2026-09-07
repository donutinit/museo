import { getCollection, type CollectionEntry } from 'astro:content';
import { videos, type VideoEntry } from '../data/videos';
import { media } from './media';

/** El stock decide el color del código de borde: ámbar para foto, olivo para cinta. */
export type Stock = 'foto' | 'cinta';

/**
 * Un cuadro de la hoja. `ratio` es el aspect nativo del original: la hoja
 * calcula el ancho a partir de él, así que nada se recorta nunca.
 */
export interface Cuadro {
  href: string;
  src: string;
  alt: string;
  ratio: number;
  w: number;
  h: number;
  titulo: string;
  /** Lo que va impreso al canto junto al número: qué clase de pieza es. */
  clase: string;
  dato: string;
  stock: Stock;
  fecha: Date;
  /** Sólo en cintas: se monta al señalar el cuadro. */
  cinta?: string;
}

/** Medidas de los posters de cada rollo de foto. */
export const medidaPoster: Record<string, [number, number]> = {
  apice: [1200, 1800],
  aria: [1600, 1067],
  bikefest: [1440, 1800],
  bikeparkesfera: [1440, 1800],
  cerrandociclos: [1200, 1800],
  donaestereso: [1200, 1800],
  ebikecamp: [1920, 2880],
  karen: [1440, 1800],
  marchas: [1200, 1800],
  poasadas: [1200, 1800],
  raulalcala: [1440, 1800],
  zara: [1440, 1800],
};

/** Fecha real de cada cinta, para ordenar el archivo por lo último que entró. */
const fechaCinta: Record<string, string> = {
  'entrevista-beto': '2026-05-24',
  'entrevista-yolanda': '2026-05-19',
  'entrevista-maricela': '2026-05-15',
  'entrevista-lalo': '2026-05-11',
  'entrevista-missael-vhs': '2026-04-23',
  parto: '2026-04-23',
  'presentacion-nave': '2026-06-03',
  'recepcion-250-toneladas': '2026-01-27',
  'cuvisa-joselin': '2026-02-24',
  'aria-lk': '2025-10-29',
  'aria-wavtech': '2025-07-16',
  'drummond-infinniguard': '2025-03-15',
};

export const medidaCinta = (aspect: VideoEntry['aspect']): [number, number] =>
  aspect === '16/9' ? [1920, 1080] : aspect === '4/3' ? [1080, 810] : [1080, 1920];

/** El oficio, no el género: cómo se nombra cada tipo de rollo. */
export const oficio: Record<CollectionEntry<'projects'>['data']['type'], string> = {
  retrato: 'retrato',
  evento: 'evento',
  comercial: 'encargo',
  personal: 'obra',
  concierto: 'en vivo',
};

/** `00:53` → `0:53`, `01:38` → `1:38`. Minutos sin cero a la izquierda. */
const corrida = (d: string) => d.replace(/^0(?=\d:)/, '');

const tituloCinta = (t: string) => t.toLowerCase().split(/\s+—\s+/)[0].trim();

export const cuadroDeObra = (p: CollectionEntry<'projects'>): Cuadro => {
  const [w, h] = medidaPoster[p.slug] ?? [1200, 1800];
  return {
    href: `/obra/${p.slug}`,
    src: media(p.data.poster),
    alt: p.data.title,
    ratio: w / h,
    w,
    h,
    titulo: p.data.title.toLowerCase(),
    clase: oficio[p.data.type],
    dato: `${p.data.photoCount} piezas`,
    stock: 'foto',
    fecha: p.data.publishedAt,
  };
};

export const cuadroDeCinta = (v: VideoEntry): Cuadro => {
  const [w, h] = medidaCinta(v.aspect);
  return {
    href: `/video/${v.slug}`,
    src: media(v.poster),
    alt: v.title,
    ratio: w / h,
    w,
    h,
    titulo: tituloCinta(v.title),
    clase: v.kind,
    dato: corrida(v.durationLabel),
    stock: 'cinta',
    fecha: new Date(fechaCinta[v.slug] ?? `${v.year}-01-01`),
    cinta: media(v.src),
  };
};

const porFecha = (a: Cuadro, b: Cuadro) => b.fecha.valueOf() - a.fecha.valueOf();

/** Todo el archivo, separado por stock, cada uno de lo más nuevo a lo más viejo. */
export async function archivo() {
  const proyectos = await getCollection('projects');
  return {
    foto: proyectos.map(cuadroDeObra).sort(porFecha),
    cinta: videos.map(cuadroDeCinta).sort(porFecha),
    piezas: proyectos.reduce((n, p) => n + p.data.photoCount, 0),
  };
}
