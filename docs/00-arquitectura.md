# arquitectura

## panorama general

```
github                       cloudflare
─────────                    ──────────
repo: museo                  ┌─ workers static assets ─┐
  ├ src/ (astro)             │  museo                  │
  ├ wrangler.jsonc     ──►   │  sirve dist/            │◄── www.vondiego.com
  ├ public/_redirects        │  _redirects, _headers   │
  ├ public/_headers          └─────────────────────────┘
  └ .github/workflows/
     └ build.yml             ┌─ r2 bucket: museo ──────┐
        │                    │  videos/                │◄── media.vondiego.com
        │ on push a main:    │  projects/              │
        ▼                    │  posters/               │
   npm ci --ignore-scripts   │  thumbnails/            │
   npm rebuild sharp esbuild │  video-posters/         │
   npm run check && build    └─────────────────────────┘
   wrangler deploy
```

no hay servidor. no hay docker en el camino de producción. no hay nada
corriendo en casa.

## componentes

### 1. github repo (este)

fuente de verdad. `git push` a `main` dispara el resto.

### 2. github actions

en cada push a `main`:

1. `npm ci --ignore-scripts` — sin postinstall scripts
2. `npm rebuild sharp esbuild` — solo los nativos conocidos
3. `npm run check` — astro check
4. `npm run build` — genera `dist/`
5. `wrangler deploy` — sube `dist/` a Workers

el paso 5 necesita los secrets `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.
ese token **no puede tener filtro de IP**: los runners de github salen por
rangos de azure.

### 3. cloudflare workers — static assets

el worker `museo` no tiene script: `wrangler.jsonc` declara `assets` sin
`main`, o sea solo sirve archivos. Cloudflare se encarga de etags,
compresión y del CDN.

dos archivos controlan el comportamiento, ambos en `public/` (astro los
copia tal cual a `dist/`):

| archivo | reemplaza a | qué hace |
|---|---|---|
| `_redirects` | los `return 301` del nginx.conf | `/work/*` → `/obra/*`, `/video` → `/obra/#cintas` |
| `_headers` | los `add_header` del nginx.conf | headers de seguridad, cache de `_astro/` |

`not_found_handling: "404-page"` sirve `/404.html`, equivalente al
`error_page 404` de nginx.

### 4. cloudflare r2 — bucket `museo`

la media pesada. el bucket vive en `WNAM` y se expone por dominio custom
en `media.vondiego.com`.

```
museo/
├ videos/          mp4 h264 + faststart
├ posters/         webp de portada
├ thumbnails/      webp chicos del índice
├ video-posters/   jpg de poster de cada cinta
└ projects/<slug>/ las piezas de cada proyecto
```

por qué R2 y no meterlo al bundle del sitio: **Workers tiene límite de 25
MiB por archivo**. los videos pesan entre 40 y 180 MB. además el egress de
R2 es gratis, que es lo que hace viable servir 1.4 GB de video sin costo.

R2 sirve `Accept-Ranges` nativamente, así que el scrub de video funciona
sin escribir código.

### 5. el puente: `src/lib/media.ts`

el contenido y las páginas siguen escribiendo rutas como `/media/...`.
`media()` las reescribe a `media.vondiego.com` al momento de render.

```ts
media('/media/videos/parto.mp4')
// → 'https://media.vondiego.com/videos/parto.mp4'
```

esto mantiene el contenido portable: si la media se muda otra vez, se
cambia una constante y no 500 rutas. para apuntar a otro lado durante
desarrollo, exportá `PUBLIC_MEDIA_BASE`.

## flujo de updates

| qué cambia | qué hacés | tiempo |
|---|---|---|
| diseño/código | `git push` | ~2 min (gha + deploy) |
| contenido (proyecto nuevo, cinta nueva) | editar `src/content/` o `src/data/videos.ts` + `git push` | ~2 min |
| media (foto/video nuevo) | subir a R2 + apuntar el contenido | inmediato en R2, ~2 min el sitio |

para subir media:

```bash
rclone copy ./nuevos r2:museo/videos \
  --header-upload "Cache-Control: public, max-age=31536000, immutable"
```

## qué pasó con lo anterior

el sitio vivía en un host docker (nginx + watchtower) expuesto por
cloudflare tunnel. eso sigue en pie pero **ya no sirve el sitio**:
el hostname `www` se quitó del ingress del tunnel.

el tunnel `26d5689f` NO se puede tumbar: también sirve `plane`, `review`
y `soli`. solo se le quitó `www`.

`Dockerfile`, `nginx.conf` y `deploy/museo.compose.yaml` siguen en el repo
como vía de rollback. cuando el cutover lleve un rato estable se pueden
borrar.
