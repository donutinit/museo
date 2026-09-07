# museo

Archivo visual de [Von Diego](mailto:contacto@vondiego.com): foto, video y obra en movimiento desde Monterrey.

El sitio funciona como una sala oscura: opening cinematográfico, índice visual, obra fotográfica, cintas de video y páginas de contacto/manifiesto. La parte pública prioriza atmósfera y archivo; las rutas comerciales ocultas se planean aparte y no deben contaminar la navegación principal.

## stack

- Astro 5, build estático.
- Todo el sistema visual en CSS a mano, en `src/styles/global.css`. Sin framework de estilos.
- Fuentes locales por `@fontsource-variable`.
- Cloudflare Workers Static Assets sirve el HTML estático.
- Cloudflare R2 sirve la media pesada desde `media.vondiego.com`.
- GitHub Actions construye y despliega con Wrangler en cada push a `main`.

Producción:

```text
www.vondiego.com     → worker `museo`
media.vondiego.com   → bucket r2 `museo`
```

Deploy:

```text
wrangler.jsonc
.github/workflows/build.yml
```

## comandos

```bash
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Usar `npm ci`, no `npm install`, salvo que se esté cambiando el lockfile a propósito.

## estructura

```text
src/
├ content/projects/   proyectos fotográficos en Markdown
├ data/videos.ts      catálogo de cintas
├ layouts/            layout base y metadatos
├ pages/              rutas Astro
└ styles/global.css   sistema visual principal

public/
├ favicon.svg
├ robots.txt
├ _redirects          rutas viejas (reemplaza los 301 del nginx)
└ _headers            headers de seguridad y cache
```

Rutas principales:

- `/` opening/reel.
- `/obra` índice visual.
- `/obra/[slug]` piezas fotográficas.
- `/video/[slug]` piezas de video.
- `/about` manifiesto.
- `/contact` correo.

Rutas viejas:

- `/work/*` redirige a `/obra/*` vía `public/_redirects`.
- `/video/` redirige a `/obra/#cintas`.

## media

Los archivos pesados no viven en git: viven en el bucket R2 `museo`, servido
desde `media.vondiego.com`.

El contenido sigue escribiendo rutas como `/media/videos/x.mp4`;
`src/lib/media.ts` las reescribe al dominio de R2 al momento de render. Para
apuntar a otro lado durante desarrollo, exportá `PUBLIC_MEDIA_BASE`.

Estructura del bucket (la key `videos/x.mp4` corresponde a `/media/videos/x.mp4`):

```text
media/
├ posters/
├ thumbnails/
├ projects/
├ video-posters/
└ videos/
```

Para video web-compatible, usar H.264 + AAC-LC + `faststart`:

```bash
ffmpeg -i input.mov \
  -vf "scale=1080:-2:flags=lanczos,setsar=1" \
  -c:v libx264 -preset slow -crf 20 -profile:v high -pix_fmt yuv420p \
  -c:a aac -profile:a aac_low -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart \
  output.mp4
```

## contenido

Proyectos fotográficos:

```text
src/content/projects/*.md
```

Videos:

```text
src/data/videos.ts
```

Al agregar media nueva, primero subirla a R2 y después apuntar el contenido al
path `/media/...`. Ver [`docs/03-deploy-cloudflare.md`](./docs/03-deploy-cloudflare.md).

## docs internos

- [`docs/00-arquitectura.md`](./docs/00-arquitectura.md): panorama técnico.
- [`docs/01-decisiones-tecnicas.md`](./docs/01-decisiones-tecnicas.md): por qué Astro, por qué R2, qué hacer con los videos.
- [`docs/03-deploy-cloudflare.md`](./docs/03-deploy-cloudflare.md): deploy y subida de media.
- [`docs/05-direccion-visual.md`](./docs/05-direccion-visual.md): dirección estética histórica.
- [`AGENTS.md`](./AGENTS.md): reglas para agentes de código.
- [`CLAUDE.md`](./CLAUDE.md): notas específicas para Claude.

`PLAN.md` es local y está ignorado por git. Úsalo para notas vivas, funnels, ideas y trabajo sin publicar.

## seguridad de dependencias

- Versiones exactas en `package.json`.
- `npm ci` para instalaciones reproducibles.
- No agregar dependencias nuevas sin justificar maintainer, necesidad y riesgo.
- Esperados como scripts nativos: `sharp` y `esbuild`.
- Producción no corre Node: Cloudflare sirve archivos estáticos.

## licencia

[hlqsthuhalv 1.0](./LICENSE). Código y estructura del sitio bajo esa licencia; el uso comercial de assets audiovisuales de Von Diego requiere permiso escrito a [contacto@vondiego.com](mailto:contacto@vondiego.com).
