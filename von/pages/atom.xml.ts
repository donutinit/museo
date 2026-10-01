import type { APIRoute } from 'astro';
import { bitacora, DESCRIPCION, REPO, CORREO } from '../lib/git';

const escapar = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** La bitácora como feed, escrita a mano: son veinte líneas, no hace falta una dependencia. */
export const GET: APIRoute = async ({ site }) => {
  const log = await bitacora();
  const abs = (ruta: string) => new URL(ruta, site).toString();
  const hora = (dia: string) => `${dia}T00:00:00Z`;

  const entradas = log
    .map(
      (e) => `  <entry>
    <title>${escapar(e.titulo)}</title>
    <link href="${abs(e.href)}"/>
    <id>${abs(e.href)}</id>
    <updated>${hora(e.dia)}</updated>
    <category term="${e.head}"/>
    <summary>${escapar(`${e.oficio}, ${e.head === 'foto' ? `${e.medida} piezas` : e.medida}`)}</summary>
  </entry>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="es-MX">
  <title>${REPO}</title>
  <subtitle>${escapar(DESCRIPCION)}</subtitle>
  <link href="${abs('/')}"/>
  <link rel="self" href="${abs('/atom.xml')}"/>
  <id>${abs('/')}</id>
  <updated>${hora(log[0].dia)}</updated>
  <author>
    <name>Von Diego</name>
    <email>${CORREO}</email>
  </author>
${entradas}
</feed>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
