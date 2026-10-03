/**
 * Derivados responsivos de la media de imagen.
 *
 * Lee los originales locales, escribe:
 *   1. `src/data/medidas.json` — la medida nativa de cada pieza, para que las
 *      páginas emitan `width`/`height` y `srcset` sin adivinar.
 *   2. un árbol `w<N>/…` con el mismo formato que el original, que es el
 *      respaldo del `<img>` para navegadores sin AVIF.
 *   3. un árbol `avif/w<N>/…/<pieza>.avif`, que es lo que pinta casi todo el
 *      mundo: el `<source>` de cada `<picture>`. Lleva también el ancho nativo,
 *      así que el original pesado sólo baja si alguien lo pide a propósito.
 *
 * Nunca se escala hacia arriba. Los originales no se tocan: los derivados viven
 * en su propio prefijo, así que deshacer esto es borrar `w400/`, `w800/`,
 * `w1600/` y `avif/` del bucket.
 *
 * Corre dentro del sandbox de npm, que sólo ve el repo: por eso los originales
 * van en `.cache/media` (ignorado por git). Para traerlos de R2:
 *
 *   rclone copy r2:museo/projects .cache/media/projects
 *   rclone copy r2:museo/posters .cache/media/posters
 *   rclone copy r2:museo/video-posters .cache/media/video-posters
 *
 *   node scripts/derivados.mjs [--origen DIR] [--salida DIR]
 *
 * Lo ya escrito en `--salida` no se vuelve a codificar: correrlo otra vez
 * después de agregar un rollo sólo procesa las piezas nuevas.
 */
import sharp from 'sharp';
import { mkdir, readdir, writeFile, stat } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { argv } from 'node:process';
// los escalones son los mismos que piden las páginas: una sola lista para los dos
import { ANCHOS, ANCHOS_AVIF } from '../src/lib/foto.ts';

const arg = (nombre, porDefecto) => {
  const i = argv.indexOf(nombre);
  return i > -1 && argv[i + 1] ? argv[i + 1] : porDefecto;
};

const ORIGEN = arg('--origen', '.cache/media');
const SALIDA = arg('--salida', '.cache/derivados');

/**
 * Calibrado contra el JPEG de respaldo (mozjpeg q82, 4:2:0) en doce piezas del
 * archivo, a 800 px: q66 queda arriba en luz y en los dos canales de color
 * (SSIM 0.967 contra 0.965) con una cuarta parte menos de peso, y conserva la
 * textura de tela, pelo y lentejuela que WebP aplana al mismo peso. Por eso no
 * hay escalón WebP.
 *
 * 4:2:0 a propósito: es el perfil base de AVIF, el único que todo navegador con
 * AVIF tiene que abrir. 4:4:4 pide el perfil alto de AV1, que es opcional y no
 * está probado en Safari viejo. El JPEG de respaldo ya era 4:2:0.
 */
const AVIF = { quality: 66, effort: 4, chromaSubsampling: '4:2:0' };

/** Sólo lo que se pinta como imagen en el sitio. */
const CARPETAS = ['posters', 'video-posters', 'projects'];
const IMAGEN = /\.(jpe?g|webp|png)$/i;

// sharp usa un solo hilo por defecto en Linux con glibc; aquí hay que exprimir
// la máquina, el codificador de AVIF es lento
sharp.concurrency(availableParallelism());
const A_LA_VEZ = Math.max(1, Math.floor(availableParallelism() / 4));

async function* caminar(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* caminar(p);
    else if (IMAGEN.test(e.name)) yield p;
  }
}

const existe = (p) => stat(p).then(() => true, () => false);

const medidas = {};
const cuenta = { escritos: 0, yaEstaban: 0, saltados: 0 };

async function escribir(destino, hacer) {
  if (await existe(destino)) { cuenta.yaEstaban++; return; }
  await mkdir(dirname(destino), { recursive: true });
  await hacer().toFile(destino);
  cuenta.escritos++;
}

async function procesar(archivo) {
  const rel = relative(ORIGEN, archivo); // p. ej. posters/apice.webp
  const { width, height, format } = await sharp(archivo).metadata();
  medidas[`/media/${rel}`] = [width, height];

  const escalada = (w) =>
    sharp(archivo).resize({ width: w, withoutEnlargement: true });

  for (const w of ANCHOS) {
    if (w >= width) { cuenta.saltados++; continue; } // nunca se escala hacia arriba
    await escribir(join(SALIDA, `w${w}`, rel), () =>
      format === 'webp'
        ? escalada(w).webp({ quality: 82 })
        : escalada(w).jpeg({ quality: 82, mozjpeg: true, progressive: true })
    );
  }

  const relAvif = rel.replace(IMAGEN, '.avif');
  for (const w of [...ANCHOS_AVIF.filter((a) => a < width), width]) {
    await escribir(join(SALIDA, 'avif', `w${w}`, relAvif), () => escalada(w).avif(AVIF));
  }
}

const cola = [];
for (const carpeta of CARPETAS) {
  const raiz = join(ORIGEN, carpeta);
  if (!(await existe(raiz))) {
    console.error(`  ! falta ${raiz}, la salto`);
    continue;
  }
  for await (const archivo of caminar(raiz)) cola.push(archivo);
}

let hechas = 0;
await Promise.all(
  Array.from({ length: A_LA_VEZ }, async () => {
    for (let archivo = cola.shift(); archivo; archivo = cola.shift()) {
      await procesar(archivo);
      hechas++;
      if (hechas % 20 === 0) console.log(`  ${hechas} piezas…`);
    }
  })
);

const orden = Object.keys(medidas).sort();
await writeFile(
  new URL('../src/data/medidas.json', import.meta.url),
  JSON.stringify(Object.fromEntries(orden.map((k) => [k, medidas[k]])), null, 2) + '\n'
);

console.log(`medidas: ${orden.length} piezas → src/data/medidas.json`);
console.log(
  `derivados: ${cuenta.escritos} escritos, ${cuenta.yaEstaban} ya estaban, ` +
  `${cuenta.saltados} saltados (el original ya era más chico)`
);
console.log(`salida: ${SALIDA}`);
console.log(`\npara subirlos (sólo agrega, no toca originales):`);
for (const p of [...ANCHOS.map((w) => `w${w}`), 'avif']) {
  console.log(
    `  rclone copy ${SALIDA}/${p} r2:museo/${p} --s3-no-check-bucket --metadata ` +
    `--metadata-set 'cache-control=public, max-age=31536000, immutable' --progress`
  );
}
