/**
 * Que cada imagen que el sitio va a pedir exista de verdad en R2.
 *
 * `src/data/medidas.json` es la lista de piezas con derivados: si una pieza
 * está ahí, las páginas emiten su `<picture>` con todos los escalones AVIF y
 * el respaldo. Si alguien corre `derivados.mjs` y se le olvida subir `avif/`,
 * el navegador pide archivos que no existen y la foto sale rota (un `<picture>`
 * no cae al respaldo cuando el AVIF da 404). Esto lo detiene antes del deploy.
 *
 * Sólo pregunta cabeceras (HEAD) y casi todo sale de la caché de Cloudflare.
 *
 *   node scripts/revisar-derivados.mjs
 */
import { readFile } from 'node:fs/promises';
import { ANCHOS, ANCHOS_AVIF, urlAvif } from '../src/lib/foto.ts';

const BASE = process.env.PUBLIC_MEDIA_BASE ?? 'https://media.vondiego.com';
const A_LA_VEZ = 24;

const medidas = JSON.parse(
  await readFile(new URL('../src/data/medidas.json', import.meta.url), 'utf8')
);

const urls = [];
for (const [ruta, [ancho]] of Object.entries(medidas)) {
  const resto = ruta.slice('/media'.length);
  urls.push(`${BASE}${resto}`);
  for (const w of ANCHOS) if (w < ancho) urls.push(`${BASE}/w${w}${resto}`);
  for (const w of [...ANCHOS_AVIF.filter((a) => a < ancho), ancho]) urls.push(urlAvif(BASE, resto, w));
}

const faltan = [];
const cola = [...urls];
await Promise.all(
  Array.from({ length: A_LA_VEZ }, async () => {
    for (let url = cola.shift(); url; url = cola.shift()) {
      let estado = 0;
      for (let intento = 0; intento < 3 && estado !== 200; intento++) {
        estado = await fetch(url, { method: 'HEAD' }).then((r) => r.status, () => 0);
      }
      if (estado !== 200) faltan.push(`${estado || 'sin red'}  ${url}`);
    }
  })
);

if (faltan.length) {
  console.error(`faltan ${faltan.length} de ${urls.length} derivados en ${BASE}:`);
  for (const f of faltan.sort()) console.error(`  ${f}`);
  console.error('\ncorre `node scripts/derivados.mjs` y sube lo que imprime al final.');
  process.exit(1);
}

console.log(`derivados: ${urls.length} archivos en ${BASE}, ninguno falta`);
