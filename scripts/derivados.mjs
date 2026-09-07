/**
 * Derivados responsivos de la media de imagen.
 *
 * Lee los originales locales, escribe:
 *   1. `src/data/medidas.json` — la medida nativa de cada pieza, para que las
 *      páginas emitan `width`/`height` y `srcset` sin adivinar.
 *   2. un árbol `w<N>/…` listo para subir a R2, con el mismo formato que el
 *      original y sin escalar hacia arriba nunca.
 *
 * Los originales no se tocan: los derivados viven en su propio prefijo, así que
 * deshacer esto es borrar `w400/`, `w800/` y `w1600/` del bucket.
 *
 *   node scripts/derivados.mjs [--origen DIR] [--salida DIR]
 */
import sharp from 'sharp';
import { mkdir, readdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { argv } from 'node:process';

const arg = (nombre, porDefecto) => {
  const i = argv.indexOf(nombre);
  return i > -1 && argv[i + 1] ? argv[i + 1] : porDefecto;
};

const ORIGEN = arg('--origen', `${process.env.HOME}/Downloads/museo-media`);
const SALIDA = arg('--salida', `${process.env.HOME}/Downloads/museo-derivados`);
const ANCHOS = [400, 800, 1600];
/** Sólo lo que se pinta como imagen en el sitio. */
const CARPETAS = ['posters', 'video-posters', 'projects'];
const IMAGEN = /\.(jpe?g|webp|png)$/i;

async function* caminar(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* caminar(p);
    else if (IMAGEN.test(e.name)) yield p;
  }
}

const medidas = {};
let hechos = 0;
let saltados = 0;

for (const carpeta of CARPETAS) {
  const raiz = join(ORIGEN, carpeta);
  try {
    await stat(raiz);
  } catch {
    console.error(`  ! falta ${raiz}, la salto`);
    continue;
  }

  for await (const archivo of caminar(raiz)) {
    const rel = relative(ORIGEN, archivo); // p. ej. posters/apice.webp
    const img = sharp(archivo);
    const { width, height, format } = await img.metadata();
    medidas[`/media/${rel}`] = [width, height];

    for (const w of ANCHOS) {
      if (w >= width) { saltados++; continue; } // nunca se escala hacia arriba
      const destino = join(SALIDA, `w${w}`, rel);
      await mkdir(dirname(destino), { recursive: true });
      const escalada = sharp(archivo).resize({ width: w, withoutEnlargement: true });
      await (format === 'webp'
        ? escalada.webp({ quality: 82 })
        : escalada.jpeg({ quality: 82, mozjpeg: true, progressive: true })
      ).toFile(destino);
      hechos++;
    }
  }
}

const orden = Object.keys(medidas).sort();
await writeFile(
  new URL('../src/data/medidas.json', import.meta.url),
  JSON.stringify(Object.fromEntries(orden.map((k) => [k, medidas[k]])), null, 2) + '\n'
);

console.log(`medidas: ${orden.length} piezas → src/data/medidas.json`);
console.log(`derivados: ${hechos} escritos, ${saltados} saltados (el original ya era más chico)`);
console.log(`salida: ${SALIDA}`);
console.log(`\npara subirlos (sólo agrega, no toca originales):`);
for (const w of ANCHOS) console.log(`  rclone copy ${SALIDA}/w${w} r2:museo/w${w} --progress`);
