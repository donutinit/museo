import type { APIRoute } from 'astro';
import { videos } from '../../../src/data/videos';
import { tieneSubtitulos, leerSubtitulos } from '../../lib/subtitulos';

export function getStaticPaths() {
  return videos.filter((v) => tieneSubtitulos(v.slug)).map((v) => ({ params: { slug: v.slug } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(leerSubtitulos(params.slug!), {
    headers: { 'Content-Type': 'text/vtt; charset=utf-8' },
  });
