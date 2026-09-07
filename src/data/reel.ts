/**
 * El reel: la secuencia que se scrollea en portada, una placa a la vez.
 * Aquí los números romanos sí son una secuencia real — vas del i al x en orden —
 * así que el marcador de posición carga información, no adorno.
 *
 * Las placas de cinta sólo guardan el `slug`: la fuente, el póster, el cuadro y
 * el año salen del catálogo en `videos.ts`, que es la única fuente de verdad.
 * Así el cache-bust de una reposición se escribe en un solo lugar.
 */
export type Foto = {
  /** Ruta cruda `/media/...`; la página le aplica `media()` y `srcset()`. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type PlacaVideo = {
  kind: 'video';
  code: string;
  /** La cinta en el catálogo de `videos.ts`. */
  slug: string;
  where: string;
  line: string;
  lineEm: string;
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

const photo = (src: string, alt: string, width: number, height: number): Foto => ({
  src,
  alt,
  width,
  height,
});

export const placas: Placa[] = [
  {
    kind: 'video',
    code: 'i / 10',
    slug: 'entrevista-yolanda',
    where: 'yolanda · monterrey',
    line: 'el archivo se abre como un',
    lineEm: 'párpado',
    girar: true,
  },
  {
    kind: 'grid',
    code: 'ii / 10',
    title: 'los',
    titleEm: 'míos',
    caption: 'obra · primer corte',
    photos: [
      photo('/media/posters/apice.webp', 'depredador ápice', 1200, 1800),
      photo('/media/posters/zara.webp', 'zara', 1440, 1800),
      photo('/media/posters/karen.webp', 'káren', 1440, 1800),
      photo('/media/posters/cerrandociclos.webp', 'cerrando ciclos', 1200, 1800),
      photo('/media/posters/marchas.webp', 'marchas eternas', 1200, 1800),
      photo('/media/posters/poasadas.webp', 'posadas', 1200, 1800),
      photo('/media/projects/apice/apice-03.jpg', 'apice · pieza 03', 1200, 1800),
      photo('/media/projects/karen/karen-02.jpg', 'káren · pieza 02', 1440, 1800),
    ],
  },
  {
    kind: 'video',
    code: 'iii / 10',
    slug: 'presentacion-nave',
    where: 'autódromo · nave',
    line: 'el espacio se mide en',
    lineEm: 'andenes',
  },
  {
    kind: 'grid',
    code: 'iv / 10',
    title: 'rodando.',
    titleEm: 'bicis',
    caption: 'oficio · ruta y polvo',
    photos: [
      photo('/media/posters/ebikecamp.webp', 'e-bike camp', 1920, 2880),
      photo('/media/projects/bikefest/bikefest-04.jpg', 'bikefest · pieza 04', 1440, 1800),
      photo('/media/projects/raulalcala/raulalcala-06.jpg', 'raúl alcalá · pieza 06', 1013, 1800),
      photo('/media/posters/bikeparkesfera.webp', 'bike park esfera', 1440, 1800),
      photo('/media/projects/ebikecamp/ebikecamp-17.jpg', 'e-bike camp · pieza 17', 1920, 2880),
      photo('/media/projects/bikefest/bikefest-11.jpg', 'bikefest · pieza 11', 1440, 1800),
      photo('/media/posters/raulalcala.webp', 'raúl alcalá challenge', 1440, 1800),
      photo('/media/projects/bikeparkesfera/bikeparkesfera-02.jpg', 'bike park esfera · pieza 02', 1800, 1012),
      photo('/media/projects/ebikecamp/ebikecamp-18.jpg', 'e-bike camp · pieza 18', 3840, 2560),
      photo('/media/posters/bikefest.webp', 'bikefest', 1440, 1800),
      photo('/media/projects/raulalcala/raulalcala-17.jpg', 'raúl alcalá · pieza 17', 1800, 1800),
      photo('/media/projects/bikeparkesfera/bikeparkesfera-15.jpg', 'bike park esfera · pieza 15', 1440, 1800),
    ],
  },
  {
    kind: 'video',
    code: 'v / 10',
    slug: 'entrevista-missael-vhs',
    where: 'missael · familia',
    line: 'la cinta no',
    lineEm: 'olvida',
  },
  {
    kind: 'grid',
    code: 'vi / 10',
    title: 'monterrey,',
    titleEm: 'piezas',
    caption: 'frames sueltos del archivo',
    photos: [
      photo('/media/projects/poasadas/poasadas-04.jpg', 'posadas · pieza 04', 1440, 1800),
      photo('/media/projects/cerrandociclos/cerrandociclos-02.jpg', 'cerrando ciclos · pieza 02', 1200, 1800),
      photo('/media/projects/poasadas/poasadas-10.jpg', 'posadas · pieza 10', 1200, 1800),
      photo('/media/projects/poasadas/poasadas-15.jpg', 'posadas · pieza 15', 1200, 1800),
      photo('/media/projects/cerrandociclos/cerrandociclos-06.jpg', 'cerrando ciclos · pieza 06', 1200, 2133),
      photo('/media/projects/cerrandociclos/cerrandociclos-08.jpg', 'cerrando ciclos · pieza 08', 1200, 2133),
      photo('/media/projects/donaestereso/donaestereso-22.jpg', 'doña estéreo · pieza 22', 1800, 1200),
      photo('/media/projects/karen/karen-03.jpg', 'káren · pieza 03', 1200, 1800),
      photo('/media/projects/zara/zara-02.jpg', 'zara · pieza 02', 1440, 1800),
      photo('/media/projects/apice/apice-05.jpg', 'apice · pieza 05', 1800, 1200),
    ],
  },
  {
    kind: 'video',
    code: 'vii / 10',
    slug: 'parto',
    where: 'parto · personal',
    line: 'el principio se ve',
    lineEm: 'corto',
  },
  {
    kind: 'video',
    code: 'viii / 10',
    slug: 'entrevista-beto',
    where: 'beto · familia',
    line: 'todo lo que se quedó',
    lineEm: 'adentro',
  },
  {
    kind: 'grid',
    code: 'ix / 10',
    title: 'doña',
    titleEm: 'estéreo',
    caption: 'soda stereo · en vivo',
    photos: [
      photo('/media/projects/donaestereso/donaestereso-03.jpg', 'doña estéreo · pieza 03', 1200, 1800),
      photo('/media/projects/donaestereso/donaestereso-07.jpg', 'doña estéreo · pieza 07', 1200, 1800),
      photo('/media/projects/donaestereso/donaestereso-12.jpg', 'doña estéreo · pieza 12', 1200, 1800),
      photo('/media/projects/donaestereso/donaestereso-17.jpg', 'doña estéreo · pieza 17', 1200, 1800),
      photo('/media/projects/donaestereso/donaestereso-22.jpg', 'doña estéreo · pieza 22', 1800, 1200),
      photo('/media/projects/donaestereso/donaestereso-26.jpg', 'doña estéreo · pieza 26', 1800, 1200),
    ],
  },
  { kind: 'final', code: 'x / 10', line: 'fin', lineEm: 'del primer acto' },
];
