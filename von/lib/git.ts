/**
 * El archivo leído como repositorio.
 *
 * Aquí no hay datos nuevos: todo sale de los rollos (`src/content/projects`) y
 * del catálogo de cintas (`src/data/videos.ts`). Lo único que hace este módulo
 * es nombrar cada cosa con el vocabulario de git: un rollo es un directorio,
 * una cinta es un archivo, el stock es la rama y el año es el tag.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { cintasPorFecha, kindLabel, type VideoEntry } from '../../src/data/videos';
import { oficio } from '../../src/lib/archivo';

export const HOST = 'vondiego.com';
export const REPO = 'museo.git';
export const SITIO_PRINCIPAL = 'https://www.vondiego.com';
export const DESCRIPCION = 'archivo de foto y video';
export const CORREO = 'contacto@vondiego.com';

export type Head = 'foto' | 'cinta';
export const HEADS: Head[] = ['foto', 'cinta'];

export interface Entrada {
  head: Head;
  slug: string;
  href: string;
  fecha: Date;
  /** `2026-05-19`: la fecha tal cual, sin edades relativas que se pudran. */
  dia: string;
  titulo: string;
  oficio: string;
  /** Como aparece en el árbol: `apice` o `entrevista-yolanda.mp4`. */
  nombre: string;
  /** Piezas del rollo o lo que corre la cinta. */
  medida: string;
  poster: string;
  /** Sólo en cintas: el archivo directo. */
  raw?: string;
}

const dia = (f: Date) => f.toISOString().slice(0, 10);

/** `00:53` → `0:53`. */
const corrida = (d: string) => d.replace(/^0(?=\d:)/, '');

const deRollo = (p: CollectionEntry<'projects'>): Entrada => ({
  head: 'foto',
  slug: p.id,
  href: `/obra/${p.id}/`,
  fecha: p.data.publishedAt,
  dia: dia(p.data.publishedAt),
  titulo: p.data.title,
  oficio: oficio[p.data.type],
  nombre: p.id,
  medida: String(p.data.photoCount),
  poster: p.data.poster,
});

const deCinta = (v: VideoEntry): Entrada => {
  const fecha = new Date(v.recordedAt);
  return {
    head: 'cinta',
    slug: v.slug,
    href: `/video/${v.slug}/`,
    fecha,
    dia: dia(fecha),
    titulo: v.title,
    oficio: kindLabel[v.kind].toLowerCase(),
    nombre: `${v.slug}.mp4`,
    medida: corrida(v.durationLabel),
    poster: v.poster,
    raw: v.src,
  };
};

/** Rollos por fecha, lo último primero: el mismo orden que usa el sitio principal. */
export async function rollos() {
  return (await getCollection('projects')).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
}

/** Todo el archivo en una sola bitácora, lo último primero. */
export async function bitacora(): Promise<Entrada[]> {
  return [...(await rollos()).map(deRollo), ...cintasPorFecha.map(deCinta)].sort(
    (a, b) => b.fecha.valueOf() - a.fecha.valueOf()
  );
}

export interface Ref {
  nombre: string;
  /** La entrada a la que apunta: la más reciente de su rama o de su año. */
  punta: Entrada;
  cuenta: number;
}

/** Una rama por stock. */
export const heads = (log: Entrada[]): Ref[] =>
  HEADS.flatMap((h) => {
    const suyas = log.filter((e) => e.head === h);
    return suyas.length ? [{ nombre: h, punta: suyas[0], cuenta: suyas.length }] : [];
  });

const anio = (e: Entrada) => e.dia.slice(0, 4);

/** Un tag por año: marca lo último que entró ese año. */
export const tags = (log: Entrada[]): Ref[] =>
  [...new Set(log.map(anio))].map((a) => {
    const suyas = log.filter((e) => anio(e) === a);
    return { nombre: a, punta: suyas[0], cuenta: suyas.length };
  });

/** Qué insignias lleva cada entrada en la bitácora. */
export const refsDe = (log: Entrada[]) => {
  const mapa = new Map<string, { head?: string; tag?: string }>();
  for (const h of heads(log)) mapa.set(h.punta.href, { ...mapa.get(h.punta.href), head: h.nombre });
  for (const t of tags(log)) mapa.set(t.punta.href, { ...mapa.get(t.punta.href), tag: t.nombre });
  return mapa;
};
