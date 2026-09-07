import { media } from '../lib/media';

/**
 * El reel: la secuencia que se scrollea en portada, una placa a la vez.
 * Aquí los números romanos sí son una secuencia real — vas del i al x en orden —
 * así que el marcador de posición carga información, no adorno.
 *
 * El orden y las fotos son los del reel original; sólo se emparejó la
 * numeración, que antes decía `/09` en nueve placas y `/10` en la última.
 */
export type Foto = {
  src: string;
  alt: string;
  href: string;
  width: number;
  height: number;
};

export type PlacaVideo = {
  kind: 'video';
  code: string;
  where: string;
  year: string;
  src: string;
  poster: string;
  aspect: '16/9' | '4/3' | '9/16';
  line: string;
  lineEm: string;
  anchor: string;
  /** En vertical, gira la cinta un cuarto a la izquierda para que llene la pantalla. */
  girar?: boolean;
};

export type PlacaGrid = {
  kind: 'grid';
  code: string;
  title: string;
  titleEm: string;
  caption: string;
  photos: Foto[];
};

export type PlacaFinal = { kind: 'final'; code: string; line: string; lineEm: string };

export type Placa = PlacaVideo | PlacaGrid | PlacaFinal;

const photo = (src: string, alt: string, href: string, width: number, height: number): Foto => ({
  src: media(src),
  alt,
  href,
  width,
  height,
});

export const placas: Placa[] = [
  {
    kind: 'video',
    code: 'i / 10',
    where: 'yolanda · monterrey',
    year: '26',
    src: '/media/videos/entrevista-yolanda.mp4',
    poster: '/media/video-posters/entrevista-yolanda.jpg',
    aspect: '16/9',
    line: 'el archivo se abre como un',
    lineEm: 'párpado',
    anchor: '/video/entrevista-yolanda',
    girar: true,
  },
  {
    kind: 'grid',
    code: 'ii / 10',
    title: 'los',
    titleEm: 'míos',
    caption: 'obra · primer corte',
    photos: [
      photo('/media/posters/apice.webp', 'depredador ápice', '/obra/apice', 1200, 1800),
      photo('/media/posters/zara.webp', 'zara', '/obra/zara', 1440, 1800),
      photo('/media/posters/karen.webp', 'káren', '/obra/karen', 1440, 1800),
      photo('/media/posters/cerrandociclos.webp', 'cerrando ciclos', '/obra/cerrandociclos', 1200, 1800),
      photo('/media/posters/marchas.webp', 'marchas eternas', '/obra/marchas', 1200, 1800),
      photo('/media/posters/poasadas.webp', 'posadas', '/obra/poasadas', 1200, 1800),
      photo('/media/projects/apice/apice-03.jpg', 'apice · pieza 03', '/obra/apice', 1200, 1800),
      photo('/media/projects/karen/karen-02.jpg', 'káren · pieza 02', '/obra/karen', 1440, 1800),
    ],
  },
  {
    kind: 'video',
    code: 'iii / 10',
    where: 'autódromo · nave',
    year: '26',
    src: '/media/videos/presentacion-nave.mp4?v=20260617-2034',
    poster: '/media/video-posters/presentacion-nave.jpg',
    aspect: '9/16',
    line: 'el espacio se mide en',
    lineEm: 'andenes',
    anchor: '/video/presentacion-nave',
  },
  {
    kind: 'grid',
    code: 'iv / 10',
    title: 'rodando.',
    titleEm: 'bicis',
    caption: 'oficio · ruta y polvo',
    photos: [
      photo('/media/posters/ebikecamp.webp', 'e-bike camp', '/obra/ebikecamp', 1920, 2880),
      photo('/media/projects/bikefest/bikefest-04.jpg', 'bikefest · pieza 04', '/obra/bikefest', 1440, 1800),
      photo('/media/projects/raulalcala/raulalcala-06.jpg', 'raúl alcalá · pieza 06', '/obra/raulalcala', 1013, 1800),
      photo('/media/posters/bikeparkesfera.webp', 'bike park esfera', '/obra/bikeparkesfera', 1440, 1800),
      photo('/media/projects/ebikecamp/ebikecamp-17.jpg', 'e-bike camp · pieza 17', '/obra/ebikecamp', 1920, 2880),
      photo('/media/projects/bikefest/bikefest-11.jpg', 'bikefest · pieza 11', '/obra/bikefest', 1440, 1800),
      photo('/media/posters/raulalcala.webp', 'raúl alcalá challenge', '/obra/raulalcala', 1440, 1800),
      photo('/media/projects/bikeparkesfera/bikeparkesfera-02.jpg', 'bike park esfera · pieza 02', '/obra/bikeparkesfera', 1800, 1012),
      photo('/media/projects/ebikecamp/ebikecamp-18.jpg', 'e-bike camp · pieza 18', '/obra/ebikecamp', 3840, 2560),
      photo('/media/posters/bikefest.webp', 'bikefest', '/obra/bikefest', 1440, 1800),
      photo('/media/projects/raulalcala/raulalcala-17.jpg', 'raúl alcalá · pieza 17', '/obra/raulalcala', 1800, 1800),
      photo('/media/projects/bikeparkesfera/bikeparkesfera-15.jpg', 'bike park esfera · pieza 15', '/obra/bikeparkesfera', 1440, 1800),
    ],
  },
  {
    kind: 'video',
    code: 'v / 10',
    where: 'missael · familia',
    year: '26',
    src: '/media/videos/entrevista-missael-vhs.mp4',
    poster: '/media/video-posters/entrevista-missael-vhs.jpg',
    aspect: '4/3',
    line: 'la cinta no',
    lineEm: 'olvida',
    anchor: '/video/entrevista-missael-vhs',
  },
  {
    kind: 'grid',
    code: 'vi / 10',
    title: 'monterrey,',
    titleEm: 'piezas',
    caption: 'frames sueltos del archivo',
    photos: [
      photo('/media/projects/poasadas/poasadas-04.jpg', 'posadas · pieza 04', '/obra/poasadas', 1440, 1800),
      photo('/media/projects/cerrandociclos/cerrandociclos-02.jpg', 'cerrando ciclos · pieza 02', '/obra/cerrandociclos', 1200, 1800),
      photo('/media/projects/poasadas/poasadas-10.jpg', 'posadas · pieza 10', '/obra/poasadas', 1200, 1800),
      photo('/media/projects/poasadas/poasadas-15.jpg', 'posadas · pieza 15', '/obra/poasadas', 1200, 1800),
      photo('/media/projects/cerrandociclos/cerrandociclos-06.jpg', 'cerrando ciclos · pieza 06', '/obra/cerrandociclos', 1200, 2133),
      photo('/media/projects/cerrandociclos/cerrandociclos-08.jpg', 'cerrando ciclos · pieza 08', '/obra/cerrandociclos', 1200, 2133),
      photo('/media/projects/donaestereso/donaestereso-22.jpg', 'doña estéreo · pieza 22', '/obra/donaestereso', 1800, 1200),
      photo('/media/projects/karen/karen-03.jpg', 'káren · pieza 03', '/obra/karen', 1200, 1800),
      photo('/media/projects/zara/zara-02.jpg', 'zara · pieza 02', '/obra/zara', 1440, 1800),
      photo('/media/projects/apice/apice-05.jpg', 'apice · pieza 05', '/obra/apice', 1800, 1200),
    ],
  },
  {
    kind: 'video',
    code: 'vii / 10',
    where: 'parto · personal',
    year: '26',
    src: '/media/videos/parto.mp4',
    poster: '/media/video-posters/parto.jpg',
    aspect: '4/3',
    line: 'el principio se ve',
    lineEm: 'corto',
    anchor: '/video/parto',
  },
  {
    kind: 'video',
    code: 'viii / 10',
    where: 'beto · familia',
    year: '26',
    src: '/media/videos/entrevista-beto.mp4',
    poster: '/media/video-posters/entrevista-beto.jpg',
    aspect: '16/9',
    line: 'todo lo que se quedó',
    lineEm: 'adentro',
    anchor: '/video/entrevista-beto',
  },
  {
    kind: 'grid',
    code: 'ix / 10',
    title: 'doña',
    titleEm: 'estéreo',
    caption: 'soda stereo · en vivo',
    photos: [
      photo('/media/projects/donaestereso/donaestereso-03.jpg', 'doña estéreo · pieza 03', '/obra/donaestereso', 1200, 1800),
      photo('/media/projects/donaestereso/donaestereso-07.jpg', 'doña estéreo · pieza 07', '/obra/donaestereso', 1200, 1800),
      photo('/media/projects/donaestereso/donaestereso-12.jpg', 'doña estéreo · pieza 12', '/obra/donaestereso', 1200, 1800),
      photo('/media/projects/donaestereso/donaestereso-17.jpg', 'doña estéreo · pieza 17', '/obra/donaestereso', 1200, 1800),
      photo('/media/projects/donaestereso/donaestereso-22.jpg', 'doña estéreo · pieza 22', '/obra/donaestereso', 1800, 1200),
      photo('/media/projects/donaestereso/donaestereso-26.jpg', 'doña estéreo · pieza 26', '/obra/donaestereso', 1800, 1200),
    ],
  },
  { kind: 'final', code: 'x / 10', line: 'fin', lineEm: 'del primer acto' },
];
