export type VideoKind = 'entrevista' | 'comercial' | 'corporativo' | 'personal';

export interface VideoEntry {
  slug: string;
  title: string;
  kind: VideoKind;
  year: number;
  durationLabel: string;
  src: string;
  poster: string;
  aspect: '9/16' | '16/9' | '4/3';
  tape?: string;
  caption?: string;
}

export const videos: VideoEntry[] = [
  {
    slug: 'entrevista-yolanda',
    title: 'Yolanda — el zorro',
    kind: 'entrevista',
    year: 2026,
    durationLabel: '00:53',
    src: '/media/videos/entrevista-yolanda.mp4',
    poster: '/media/video-posters/entrevista-yolanda.jpg',
    aspect: '16/9',
    tape: 'EXP/01 · Yolanda',
    caption: 'Si yo vuelvo a nacer, yo le pediría a Dios que me diera el mismo padre.',
  },
  {
    slug: 'entrevista-beto',
    title: 'Beto — el mayor de los Garza Núñez',
    kind: 'entrevista',
    year: 2026,
    durationLabel: '01:38',
    src: '/media/videos/entrevista-beto.mp4',
    poster: '/media/video-posters/entrevista-beto.jpg',
    aspect: '16/9',
    tape: 'EXP/02 · Beto',
    caption: 'Somos seis hermanos, originalmente. Familia artística.',
  },
  {
    slug: 'entrevista-lalo',
    title: 'Lalo — Carlos era bien juguetón',
    kind: 'entrevista',
    year: 2026,
    durationLabel: '00:26',
    src: '/media/videos/entrevista-lalo.mp4',
    poster: '/media/video-posters/entrevista-lalo.jpg',
    aspect: '16/9',
    tape: 'EXP/03 · Lalo',
    caption: 'Yo la que quería mucho era Marisela.',
  },
  {
    slug: 'entrevista-maricela',
    title: 'Maricela — la yunta de güeyes',
    kind: 'entrevista',
    year: 2026,
    durationLabel: '00:29',
    src: '/media/videos/entrevista-maricela.mp4',
    poster: '/media/video-posters/entrevista-maricela.jpg',
    aspect: '16/9',
    tape: 'EXP/04 · Maricela',
    caption: 'Concha empieza a gritar y gritar porque venía la yunta de güeyes.',
  },
  {
    slug: 'entrevista-missael-vhs',
    title: 'Missael — el padrino Edgar',
    kind: 'entrevista',
    year: 2026,
    durationLabel: '00:43',
    src: '/media/videos/entrevista-missael-vhs.mp4',
    poster: '/media/video-posters/entrevista-missael-vhs.jpg',
    aspect: '4/3',
    tape: 'EXP/05 · Missael',
    caption: 'Ya los invité a mi fiesta el sábado 13 de junio.',
  },
  {
    slug: 'aria-lk',
    title: 'ARIA en LK',
    kind: 'corporativo',
    year: 2025,
    durationLabel: '01:04',
    src: '/media/videos/aria-lk.mp4',
    poster: '/media/video-posters/aria-lk.jpg',
    aspect: '9/16',
    tape: 'CASO 05 · ARIA',
    caption: 'Cuando en un proyecto surge una necesidad específica de climatización, ahí entramos nosotros.',
  },
  {
    slug: 'aria-wavtech',
    title: 'ARIA en Wavtech',
    kind: 'corporativo',
    year: 2025,
    durationLabel: '00:53',
    src: '/media/videos/aria-wavtech.mp4',
    poster: '/media/video-posters/aria-wavtech.jpg',
    aspect: '9/16',
    tape: 'CASO 06 · ARIA',
    caption: 'Calidad que se siente, eficiencia que se nota.',
  },
  {
    slug: 'cuvisa-joselin',
    title: 'Cuvisa — DVR Pro & mini DVR',
    kind: 'corporativo',
    year: 2026,
    durationLabel: '01:57',
    src: '/media/videos/cuvisa-joselin.mp4',
    poster: '/media/video-posters/cuvisa-joselin.jpg',
    aspect: '9/16',
    tape: 'CASO 07 · Drummond',
    caption: 'Volumen de refrigerante variable, control independiente por zonas.',
  },
  {
    slug: 'drummond-infinniguard',
    title: 'Drummond × InfinniGuard',
    kind: 'comercial',
    year: 2025,
    durationLabel: '01:08',
    src: '/media/videos/drummond-infinniguard.mp4',
    poster: '/media/video-posters/drummond-infinniguard.jpg',
    aspect: '9/16',
    tape: 'CASO 08 · Drummond',
    caption: 'Aplicación de InfinniGuard sobre una condensadora Drummond Air.',
  },
  {
    slug: 'presentacion-nave',
    title: 'Presentación de nave industrial',
    kind: 'corporativo',
    year: 2026,
    durationLabel: '01:02',
    src: '/media/videos/presentacion-nave.mp4?v=20260617-2034',
    poster: '/media/video-posters/presentacion-nave.jpg',
    aspect: '9/16',
    tape: 'CASO 09 · Autódromo IP',
    caption: '31,168 m² de nave, 18 andenes, corredor Monterrey–Laredo.',
  },
  {
    slug: 'recepcion-250-toneladas',
    title: 'Recepción · 250 toneladas',
    kind: 'corporativo',
    year: 2026,
    durationLabel: '01:14',
    src: '/media/videos/recepcion-250-toneladas.mp4',
    poster: '/media/video-posters/recepcion-250-toneladas.jpg',
    aspect: '9/16',
    tape: 'CASO 10 · operación',
    caption: 'Coordinación de recepción industrial de gran tonelaje.',
  },
  {
    slug: 'parto',
    title: 'Parto',
    kind: 'personal',
    year: 2026,
    durationLabel: '00:40',
    src: '/media/videos/parto.mp4',
    poster: '/media/video-posters/parto.jpg',
    aspect: '4/3',
    tape: 'PIEZA · obra personal',
    caption: 'Un instante. Un nacimiento.',
  },
];

export const youtubeFeature = {
  id: 'gQPOegxVKmo',
  title: 'Canal · pieza destacada',
  url: 'https://youtu.be/gQPOegxVKmo',
  caption:
    'Transmisión desde el archivo de Von Diego. Recortada con cinta, cinco capas y un tag a mano.',
};

export const kindLabel: Record<VideoKind, string> = {
  entrevista: 'Entrevista',
  comercial: 'Comercial',
  corporativo: 'Corporativo',
  personal: 'Obra personal',
};

export const interviews = videos.filter((v) => v.kind === 'entrevista');
export const nonInterviews = videos.filter((v) => v.kind !== 'entrevista');
