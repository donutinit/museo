/**
 * El archivo leído como producto de software.
 *
 * Aquí no hay datos nuevos: todo sale de los rollos (`src/content/projects`) y
 * del catálogo de cintas (`src/data/videos.ts`). Lo único que hace este módulo
 * es nombrar cada cosa con el vocabulario de un producto: un rollo es una
 * versión, una cinta es una demo, el oficio es el módulo y la fecha es el
 * número de versión.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { cintasPorFecha, kindLabel, type VideoEntry } from '../../src/data/videos';
import { oficio, medidaCinta } from '../../src/lib/archivo';
import { medidaDe, altDe, ANCHOS } from '../../src/lib/media';
import { duracionSegundos } from '../../src/lib/seo';

export const PRODUCTO = 'Von Diego';
export const SITIO_PRINCIPAL = 'https://www.vondiego.com';
export const SITIO_VON = 'https://von.vondiego.com';
export const REPO = 'https://github.com/donutinit/museo';
export const CORREO = 'contacto@vondiego.com';

export type Tipo = 'foto' | 'cinta';

export interface Version {
  tipo: Tipo;
  slug: string;
  href: string;
  fecha: Date;
  /** `2026-05-19`, para `<time datetime>`. */
  dia: string;
  /** `19 de mayo de 2026`. */
  diaLargo: string;
  /** La fecha como número de versión: `2026.5.19`. */
  version: string;
  titulo: string;
  /** El oficio, con mayúscula: `Retrato`, `En vivo`, `Entrevista`. */
  modulo: string;
  anio: number;
  poster: string;
  /** Medida nativa del póster. */
  pw: number;
  ph: number;
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

const largo = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `2026-05-19` → `2026.5.19`. Sin ceros: así se escribe un calver. */
const calver = (f: Date) => dia(f).split('-').map(Number).join('.');

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** `00:53` → `0:53`. */
export const corrida = (d: string) => d.replace(/^0(?=\d:)/, '');

const deRollo = (p: CollectionEntry<'projects'>): Version => ({
  tipo: 'foto',
  slug: p.id,
  href: `/obra/${p.id}/`,
  fecha: p.data.publishedAt,
  dia: dia(p.data.publishedAt),
  diaLargo: largo.format(p.data.publishedAt),
  version: calver(p.data.publishedAt),
  titulo: p.data.title,
  modulo: mayuscula(oficio[p.data.type]),
  anio: p.data.year,
  poster: p.data.poster,
  pw: p.data.posterWidth,
  ph: p.data.posterHeight,
  rollo: p,
});

const deCinta = (v: VideoEntry): Version => {
  const fecha = new Date(v.recordedAt);
  const [pw, ph] = medidaDe(v.poster) ?? medidaCinta(v.aspect);
  return {
    tipo: 'cinta',
    slug: v.slug,
    href: `/video/${v.slug}/`,
    fecha,
    dia: dia(fecha),
    diaLargo: largo.format(fecha),
    version: calver(fecha),
    titulo: v.title,
    modulo: kindLabel[v.kind],
    anio: v.year,
    poster: v.poster,
    pw,
    ph,
    cinta: v,
  };
};

/** Todo el archivo en un solo changelog, lo último primero. */
export async function versiones(): Promise<Version[]> {
  const rollos = await getCollection('projects');
  return [...rollos.map(deRollo), ...cintasPorFecha.map(deCinta)].sort(
    (a, b) => b.fecha.valueOf() - a.fecha.valueOf()
  );
}

/** Las piezas de un rollo, en el orden del rollo. */
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

export interface Modulo {
  nombre: string;
  tipo: Tipo;
  /** Lo último primero. */
  versiones: Version[];
  /** Piezas (foto) o segundos de cinta que suma el módulo. */
  medida: string;
}

/** `727` → `12:07`. */
export const reloj = (segundos: number) =>
  `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;

/** Un módulo por oficio, en el orden en que aparecen en el changelog. */
export const modulos = (log: Version[]): Modulo[] =>
  [...new Set(log.map((v) => `${v.tipo}/${v.modulo}`))].map((clave) => {
    const [tipo, nombre] = clave.split('/') as [Tipo, string];
    const suyas = log.filter((v) => v.tipo === tipo && v.modulo === nombre);
    const medida =
      tipo === 'foto'
        ? `${suyas.reduce((n, v) => n + (v.rollo?.data.photoCount ?? 0), 0)} piezas`
        : `${reloj(suyas.reduce((n, v) => n + duracionSegundos(v.cinta!.durationLabel), 0))} de cinta`;
    return { nombre, tipo, versiones: suyas, medida };
  });

/** Los números del archivo, para la barra de estado y las fichas. */
export const totales = (log: Version[]) => {
  const rollos = log.filter((v) => v.tipo === 'foto');
  const cintas = log.filter((v) => v.tipo === 'cinta');
  return {
    rollos: rollos.length,
    cintas: cintas.length,
    piezas: rollos.reduce((n, v) => n + (v.rollo?.data.photoCount ?? 0), 0),
    corre: reloj(cintas.reduce((n, v) => n + duracionSegundos(v.cinta!.durationLabel), 0)),
    cuadros: [...new Set(cintas.map((v) => v.cinta!.aspect))],
    anchos: ANCHOS,
  };
};

/** `3 versiones`, `1 versión`. */
export const cuenta = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
