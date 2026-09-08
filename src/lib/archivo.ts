import { getCollection, type CollectionEntry } from 'astro:content';
import { cintasPorFecha, type VideoEntry } from '../data/videos';
import { medidaDe } from './media';

/** El stock decide el color del código de borde: ámbar para foto, olivo para cinta. */
export type Stock = 'foto' | 'cinta';

/**
 * Un cuadro de la hoja. `src` va crudo (`/media/...`): el componente le aplica
 * `media()` y `srcset()`. `ratio` es el aspect nativo del original, así que la
 * hoja saca el ancho de ahí y nada se recorta nunca.
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
  const { posterWidth: w, posterHeight: h } = p.data;
  return {
    href: `/obra/${p.id}/`,
    src: p.data.poster,
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
  const [w, h] = medidaDe(v.poster) ?? medidaCinta(v.aspect);
  return {
    href: `/video/${v.slug}/`,
    src: v.poster,
    alt: v.title,
    ratio: w / h,
    w,
    h,
    titulo: tituloCinta(v.title),
    clase: v.kind,
    dato: corrida(v.durationLabel),
    stock: 'cinta',
    fecha: new Date(v.recordedAt),
    cinta: v.src,
  };
};

const porFecha = (a: Cuadro, b: Cuadro) => b.fecha.valueOf() - a.fecha.valueOf();

/** Todo el archivo, separado por stock, cada uno de lo más nuevo a lo más viejo. */
export async function archivo() {
  const proyectos = await getCollection('projects');
  return {
    foto: proyectos.map(cuadroDeObra).sort(porFecha),
    cinta: cintasPorFecha.map(cuadroDeCinta),
    piezas: proyectos.reduce((n, p) => n + p.data.photoCount, 0),
  };
}
