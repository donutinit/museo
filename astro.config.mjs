import { readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { videos } from './src/data/videos.ts';
import { media } from './src/lib/media.ts';
import { descripcionCinta, duracionSegundos } from './src/lib/seo.ts';
import altJson from './src/data/alt.json' with { type: 'json' };

const SITIO = 'https://www.vondiego.com';
const abs = (ruta) => new URL(media(ruta), SITIO).toString();

/**
 * El frontmatter de los rollos, leído a mano: `astro:content` no existe todavía
 * cuando se evalúa esta config, y aquí sólo hacen falta cuatro campos.
 */
const rollos = readdirSync('./src/content/projects')
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const crudo = readFileSync(`./src/content/projects/${f}`, 'utf8');
    const campo = (n) => crudo.match(new RegExp(`^${n}: *"?(.+?)"?$`, 'm'))?.[1];
    return {
      slug: f.replace(/\.md$/, ''),
      title: campo('title'),
      poster: campo('poster'),
      publishedAt: campo('publishedAt'),
      photoCount: Number(campo('photoCount')),
      photosDir: campo('photosDir'),
      photosPrefix: campo('photosPrefix'),
    };
  });

/** `/obra/<slug>/` y `/video/<slug>/` → qué media anunciar y de cuándo es. */
const extras = new Map();

for (const v of videos) {
  extras.set(`${SITIO}/video/${v.slug}/`, {
    img: [{ url: abs(v.poster), title: v.title, caption: v.caption ?? v.title }],
    video: [
      {
        thumbnail_loc: abs(v.poster),
        title: v.title,
        description: descripcionCinta(v),
        content_loc: abs(v.src),
        duration: duracionSegundos(v.durationLabel),
        family_friendly: 'yes',
      },
    ],
  });
}

for (const r of rollos) {
  const piezas = Array.from({ length: r.photoCount }, (_, i) => {
    const ruta = `${r.photosDir}${r.photosPrefix}-${String(i + 1).padStart(2, '0')}.jpg`;
    return {
      url: abs(ruta),
      title: `${r.title}, pieza ${i + 1}`,
      ...(altJson[ruta] ? { caption: altJson[ruta] } : {}),
    };
  });
  extras.set(`${SITIO}/obra/${r.slug}/`, {
    lastmod: new Date(r.publishedAt).toISOString(),
    img: [
      { url: abs(r.poster), title: r.title, caption: altJson[r.poster] ?? r.title },
      ...piezas,
    ],
  });
}

export default defineConfig({
  site: SITIO,
  integrations: [
    sitemap({
      namespaces: { image: true, video: true },
      serialize(item) {
        const extra = extras.get(item.url);
        return extra ? { ...item, ...extra } : item;
      },
    }),
  ],
});
