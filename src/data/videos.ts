export type VideoKind = 'entrevista' | 'comercial' | 'corporativo' | 'personal';

export interface VideoEntry {
  slug: string;
  title: string;
  kind: VideoKind;
  year: number;
  /** Fecha real de la cinta. Ordena el archivo por lo último que entró. */
  date: string;
  durationLabel: string;
  src: string;
  poster: string;
  aspect: '9/16' | '16/9' | '4/3';
  caption?: string;
}

export const videos: VideoEntry[] = [
  {
    slug: 'entrevista-yolanda',
    title: 'Yolanda — el zorro',
    kind: 'entrevista',
    year: 2026,
    date: '2026-05-19',
    durationLabel: '00:53',
    src: '/media/videos/entrevista-yolanda.mp4',
    poster: '/media/video-posters/entrevista-yolanda.jpg',
    aspect: '16/9',
    caption: 'Si yo vuelvo a nacer, yo le pediría a Dios que me diera el mismo padre.',
  },
  {
    slug: 'entrevista-beto',
    title: 'Beto — el mayor de los Garza Núñez',
    kind: 'entrevista',
    year: 2026,
    date: '2026-05-24',
    durationLabel: '01:38',
    src: '/media/videos/entrevista-beto.mp4',
    poster: '/media/video-posters/entrevista-beto.jpg',
    aspect: '16/9',
    caption: 'Somos seis hermanos, originalmente. Familia artística.',
  },
  {
    slug: 'entrevista-lalo',
    title: 'Lalo — Carlos era bien juguetón',
    kind: 'entrevista',
    year: 2026,
    date: '2026-05-11',
    durationLabel: '00:26',
    src: '/media/videos/entrevista-lalo.mp4',
    poster: '/media/video-posters/entrevista-lalo.jpg',
    aspect: '16/9',
    caption: 'Yo la que quería mucho era Marisela.',
  },
  {
    slug: 'entrevista-maricela',
    title: 'Maricela — la yunta de güeyes',
    kind: 'entrevista',
    year: 2026,
    date: '2026-05-15',
    durationLabel: '00:29',
    src: '/media/videos/entrevista-maricela.mp4',
    poster: '/media/video-posters/entrevista-maricela.jpg',
    aspect: '16/9',
    caption: 'Concha empieza a gritar y gritar porque venía la yunta de güeyes.',
  },
  {
    slug: 'entrevista-missael-vhs',
    title: 'Missael — el padrino Edgar',
    kind: 'entrevista',
    year: 2026,
    date: '2026-04-23',
    durationLabel: '00:43',
    src: '/media/videos/entrevista-missael-vhs.mp4',
    poster: '/media/video-posters/entrevista-missael-vhs.jpg',
    aspect: '4/3',
    caption: 'Ya los invité a mi fiesta el sábado 13 de junio.',
  },
  {
    slug: 'aria-lk',
    title: 'ARIA en LK',
    kind: 'corporativo',
    year: 2025,
    date: '2025-10-29',
    durationLabel: '01:04',
    src: '/media/videos/aria-lk.mp4',
    poster: '/media/video-posters/aria-lk.jpg',
    aspect: '9/16',
    caption: 'Cuando en un proyecto surge una necesidad específica de climatización, ahí entramos nosotros.',
  },
  {
    slug: 'aria-wavtech',
    title: 'ARIA en Wavtech',
    kind: 'corporativo',
    year: 2025,
    date: '2025-07-16',
    durationLabel: '00:53',
    src: '/media/videos/aria-wavtech.mp4',
    poster: '/media/video-posters/aria-wavtech.jpg',
    aspect: '9/16',
    caption: 'Climatización industrial para ARIA, en planta de Wavtech.',
  },
  {
    slug: 'cuvisa-joselin',
    title: 'Cuvisa — DVR Pro & mini DVR',
    kind: 'corporativo',
    year: 2026,
    date: '2026-02-24',
    durationLabel: '01:57',
    src: '/media/videos/cuvisa-joselin.mp4',
    poster: '/media/video-posters/cuvisa-joselin.jpg',
    aspect: '9/16',
    caption: 'Volumen de refrigerante variable, control independiente por zonas.',
  },
  {
    slug: 'drummond-infinniguard',
    title: 'Drummond × InfinniGuard',
    kind: 'comercial',
    year: 2025,
    date: '2025-03-15',
    durationLabel: '01:08',
    src: '/media/videos/drummond-infinniguard.mp4',
    poster: '/media/video-posters/drummond-infinniguard.jpg',
    aspect: '9/16',
    caption: 'Aplicación de InfinniGuard sobre una condensadora Drummond Air.',
  },
  {
    slug: 'presentacion-nave',
    title: 'Presentación de nave industrial',
    kind: 'corporativo',
    year: 2026,
    date: '2026-06-03',
    durationLabel: '01:02',
    // el `?v=` es cache-bust de una reposición en R2, que se sirve immutable
    src: '/media/videos/presentacion-nave.mp4?v=20260617-2034',
    poster: '/media/video-posters/presentacion-nave.jpg',
    aspect: '9/16',
    caption: '31,168 m² de nave, 18 andenes, corredor Monterrey–Laredo.',
  },
  {
    slug: 'recepcion-250-toneladas',
    title: 'Recepción · 250 toneladas',
    kind: 'corporativo',
    year: 2026,
    date: '2026-01-27',
    durationLabel: '01:14',
    src: '/media/videos/recepcion-250-toneladas.mp4',
    poster: '/media/video-posters/recepcion-250-toneladas.jpg',
    aspect: '9/16',
    caption: 'Coordinación de recepción industrial de gran tonelaje.',
  },
  {
    slug: 'parto',
    title: 'Parto',
    kind: 'personal',
    year: 2026,
    date: '2026-04-23',
    durationLabel: '00:40',
    src: '/media/videos/parto.mp4',
    poster: '/media/video-posters/parto.jpg',
    aspect: '4/3',
    caption: 'Un instante. Un nacimiento.',
  },
];

export const kindLabel: Record<VideoKind, string> = {
  entrevista: 'Entrevista',
  comercial: 'Comercial',
  corporativo: 'Corporativo',
  personal: 'Obra personal',
};

/** El archivo entero en un solo orden: lo último que entró va primero. */
export const cintasPorFecha: VideoEntry[] = [...videos].sort(
  (a, b) => Date.parse(b.date) - Date.parse(a.date)
);

export const cintaPorSlug = (slug: string): VideoEntry => {
  const v = videos.find((x) => x.slug === slug);
  if (!v) throw new Error(`no existe la cinta "${slug}" en el catálogo`);
  return v;
};
