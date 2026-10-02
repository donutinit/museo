import type { APIRoute } from 'astro';
import { videos } from '../../../src/data/videos';
import { tieneSubtitulos, leerSubtitulos } from '../../../von/lib/subtitulos';

// los subtítulos viven en el `public/` del sitio principal: se vuelven a emitir aquí
export function getStaticPaths() {
  return videos.filter((v) => tieneSubtitulos(v.slug)).map((v) => ({ params: { slug: v.slug } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(leerSubtitulos(params.slug!), {
    headers: { 'Content-Type': 'text/vtt; charset=utf-8' },
  });
