/**
 * Señales para máquinas: JSON-LD y perfiles.
 *
 * Nada de esto se ve en pantalla, así que no compite con la imagen ni mete
 * microcopy en la UI. Sale de los metadatos que el archivo ya tenía escritos:
 * lugar, año, oficio, duración, cliente.
 */
import type { VideoEntry } from '../data/videos';
import { kindLabel } from '../data/videos';
import { media, medidaDe } from './media';

export const SITIO = 'https://www.vondiego.com';
export const AUTOR = 'Von Diego';
export const CORREO = 'contacto@vondiego.com';

/** El ancla de identidad: todo lo demás cuelga de aquí con `@id`. */
export const ID_PERSONA = `${SITIO}/#vondiego`;

/** `sameAs`: lo que le dice a un buscador que estos perfiles son la misma entidad. */
export const PERFILES = [
  'https://www.youtube.com/@vondiegoa',
  'https://www.instagram.com/fotos.von.diego',
  'https://github.com/donutinit',
];

/** `01:38` → `PT1M38S` */
export const duracionISO = (etiqueta: string): string => {
  const [m, s] = etiqueta.split(':').map(Number);
  return `PT${m ? `${m}M` : ''}${s}S`;
};

/** `01:38` → 98 */
export const duracionSegundos = (etiqueta: string): number => {
  const [m, s] = etiqueta.split(':').map(Number);
  return m * 60 + s;
};

/** Términos descriptivos para buscadores; la interfaz conserva “cinta”. */
export const tipoCintaSeo: Record<VideoEntry['kind'], string> = {
  entrevista: 'Entrevista en video',
  comercial: 'Video comercial',
  corporativo: 'Video corporativo',
  personal: 'Obra audiovisual',
};

export const descripcionCinta = (v: VideoEntry): string =>
  `${tipoCintaSeo[v.kind]}: ${v.title}, ${v.year}, duración ${v.durationLabel}. `
  + `${v.caption ? `${v.caption} ` : ''}Del archivo audiovisual de ${AUTOR} en Monterrey.`;

const absoluta = (ruta: string) => new URL(media(ruta), SITIO).toString();

export const persona = () => ({
  '@type': 'Person',
  '@id': ID_PERSONA,
  name: AUTOR,
  url: SITIO,
  email: CORREO,
  jobTitle: 'Fotógrafo y videasta',
  knowsLanguage: 'es-MX',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Monterrey',
    addressRegion: 'NL',
    addressCountry: 'MX',
  },
  sameAs: PERFILES,
});

export const sitio = () => ({
  '@type': 'WebSite',
  '@id': `${SITIO}/#sitio`,
  url: SITIO,
  name: AUTOR,
  alternateName: [`${AUTOR} Archivo`, 'vondiego.com'],
  description: 'Portafolio de fotografía y video de Von Diego en Monterrey, México.',
  inLanguage: 'es-MX',
  publisher: { '@id': ID_PERSONA },
});

export const imagen = (ruta: string, descripcion: string) => {
  const medida = medidaDe(ruta);
  return {
    '@type': 'ImageObject',
    contentUrl: absoluta(ruta),
    ...(medida ? { width: medida[0], height: medida[1] } : {}),
    caption: descripcion,
    creator: { '@id': ID_PERSONA },
  };
};

export const cinta = (v: VideoEntry) => ({
  '@type': 'VideoObject',
  '@id': `${SITIO}/video/${v.slug}/#cinta`,
  name: v.title,
  description: descripcionCinta(v),
  thumbnailUrl: absoluta(v.poster),
  contentUrl: absoluta(v.src),
  dateCreated: v.recordedAt,
  duration: duracionISO(v.durationLabel),
  genre: kindLabel[v.kind],
  inLanguage: 'es-MX',
  isFamilyFriendly: true,
  creator: { '@id': ID_PERSONA },
  contentLocation: { '@type': 'Place', name: 'Monterrey, MX' },
});

/** Migas: Inicio › Archivo › la pieza. */
export const migas = (tramos: { nombre: string; ruta: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: tramos.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.nombre,
    item: new URL(t.ruta, SITIO).toString(),
  })),
});

/** Envuelve todo en un solo grafo, que es como Google prefiere leerlo. */
export const grafo = (...nodos: object[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodos,
});
