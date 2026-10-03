# deploy en cloudflare

el sitio se sirve desde Workers Static Assets; la media desde un bucket R2.

## piezas

| pieza | nombre | hostname |
|---|---|---|
| worker | `museo` | `www.vondiego.com` |
| worker | `museo-von` | `von.vondiego.com` |
| worker | `museo-dev` | `dev.vondiego.com` |
| worker | `museo-tube` | `tube.vondiego.com` |
| worker | `museo-ig` | `ig.vondiego.com` |
| bucket r2 | `museo` | `media.vondiego.com` |

## von

`von.vondiego.com` es el mismo archivo con piel de gitweb. Es un segundo sitio
dentro de este repo: sus páginas viven en `von/`, pero lee los mismos rollos,
el mismo catálogo de cintas y la misma media. Un rollo nuevo sale en los dos.

| | sitio principal | von |
|---|---|---|
| config de astro | `astro.config.mjs` | `astro.von.config.mjs` |
| páginas | `src/pages` | `von/pages` |
| `public/` | `public/` | `von/public/` |
| salida | `dist/` | `dist-von/` |
| config de wrangler | `wrangler.jsonc` | `wrangler.von.jsonc` |

```bash
npm run dev:von
npm run build:von
npx wrangler@4.129.0 deploy --config wrangler.von.jsonc
```

El push a `main` despliega los cinco: `museo`, `museo-von`, `museo-dev`, `museo-tube` y `museo-ig`.

El dominio ya está conectado (sept 2026). No lo hace el deploy: si algún día
hay que rehacerlo, es una sola vez, a mano, en el dashboard → Workers & Pages →
`museo-von` → Settings → Domains & Routes → Add → Custom domain →
`von.vondiego.com`.

von no tiene sitemap: cada página apunta su canónico a la misma pieza en
`www.vondiego.com`, que es la que debe quedar en el índice.

Los textos de `/about/` y `/contact/` están copiados en `von/textos/`. Si se
cambia el manifiesto en `src/pages/about.astro`, hay que cambiarlo también ahí.

## dev

`dev.vondiego.com` es el mismo archivo vendido como producto de software:
landing, changelog, docs y demos. Mismo trato que von: sus páginas viven en
`dev/` y no tiene contenido propio. Un rollo es una versión, una cinta es una
demo y la fecha es el número de versión (`dev/lib/producto.ts`).

| | dev |
|---|---|
| config de astro | `astro.dev.config.mjs` |
| páginas | `dev/pages` |
| `public/` | `dev/public/` |
| salida | `dist-dev/` |
| config de wrangler | `wrangler.dev.jsonc` |

```bash
npm run dev:dev
npm run build:dev
npx wrangler@4.129.0 deploy --config wrangler.dev.jsonc
```

El push a `main` lo despliega al final, después de `museo` y `museo-von`.

El dominio ya está conectado (oct 2026). No lo hace el deploy: si algún día hay
que rehacerlo, es una sola vez, a mano, en el dashboard → Workers & Pages →
`museo-dev` → Settings → Domains & Routes → Add → Custom domain →
`dev.vondiego.com`.

No copia textos: el manifiesto y el contacto los lee de `von/textos/`, y los
subtítulos de `public/captions/` a través de `von/lib/subtitulos.ts`. Tampoco
tiene sitemap; el canónico de cada página apunta a `www.vondiego.com`.

## tube

`tube.vondiego.com` es el mismo archivo con piel de sitio de videos (el logo
dice VonTube). Mismo trato que von y dev: sus páginas viven en `tube/` y no
tiene contenido propio. Una cinta apaisada es un video, una cinta vertical es
un short y un rollo es una playlist de fotos (`tube/lib/canal.ts`).

| | tube |
|---|---|
| config de astro | `astro.tube.config.mjs` |
| páginas | `tube/pages` |
| `public/` | `tube/public/` |
| salida | `dist-tube/` |
| config de wrangler | `wrangler.tube.jsonc` |

```bash
npm run dev:tube
npm run build:tube
npx wrangler@4.129.0 deploy --config wrangler.tube.jsonc
```

El push a `main` lo despliega al final, después de los otros tres.

El dominio ya está conectado (oct 2026). No lo hace el deploy: si algún día hay
que rehacerlo, es una sola vez, a mano, en el dashboard → Workers & Pages →
`museo-tube` → Settings → Domains & Routes → Add → Custom domain →
`tube.vondiego.com`.

No inventa números: no hay vistas, likes ni suscriptores. "Suscribirse" lleva
al canal de YouTube que está en `PERFILES` (`src/lib/seo.ts`). El buscador de la
cabecera cae en `/results/`, que trae todo el canal y filtra en el navegador.

Igual que dev, lee el manifiesto y el contacto de `von/textos/` y los
subtítulos a través de `von/lib/subtitulos.ts`. Sin sitemap; el canónico de
cada página apunta a `www.vondiego.com`.

## ig

`ig.vondiego.com` es el mismo archivo con piel de red social de fotos (el logo
dice Vongram). Mismo trato que von, dev y tube: sus páginas viven en `ig/` y no
tiene contenido propio. Un rollo es una publicación en carrusel y también una
historia; una cinta es un reel (`ig/lib/perfil.ts`).

`/reels/` es la vista de reels: una cinta por pantalla, deslizando, y al llegar
al final se cuelga otra vuelta. Cada reel tiene su ancla (`/reels/#parto`), que
es a donde mandan las retículas del perfil y del buscador. La retícula de reels
del perfil vive en `/about/reels/`.

| | ig |
|---|---|
| config de astro | `astro.ig.config.mjs` |
| páginas | `ig/pages` |
| `public/` | `ig/public/` |
| salida | `dist-ig/` |
| config de wrangler | `wrangler.ig.jsonc` |

```bash
npm run dev:ig
npm run build:ig
npx wrangler@4.129.0 deploy --config wrangler.ig.jsonc
```

El push a `main` lo despliega al final, después de los otros cuatro.

El dominio ya está conectado (oct 2026). No lo hace el deploy: si algún día hay
que rehacerlo, es una sola vez, a mano, en el dashboard → Workers & Pages →
`museo-ig` → Settings → Domains & Routes → Add → Custom domain →
`ig.vondiego.com`.

No inventa números: no hay seguidores, likes ni comentarios. "Seguir" lleva al
perfil de Instagram que está en `PERFILES` (`src/lib/seo.ts`), de donde sale
también el nombre de usuario. "Me gusta" se guarda en el navegador de quien lo
toca (`localStorage`) y no sale de ahí.

Igual que dev y tube, lee el manifiesto y el contacto de `von/textos/` y los
subtítulos a través de `von/lib/subtitulos.ts`. Sin sitemap; el canónico de
cada página apunta a `www.vondiego.com`.

## deploy manual (desde local)

necesitás las credenciales en un archivo fuera del repo:

```sh
# ~/.config/cloudflare/portfolio.env   (chmod 600, NO commitear)
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
```

luego:

```bash
set -a; . ~/.config/cloudflare/portfolio.env; set +a
npm ci --ignore-scripts && npm rebuild sharp esbuild
npm run check && npm run build
npx wrangler@4.129.0 deploy
```

## deploy automático (github actions)

`.github/workflows/build.yml` hace lo mismo en cada push a `main`.

requiere dos secrets en el repo (Settings → Secrets → Actions):

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

⚠️ **el token de CI no puede tener filtro de IP.** los runners de github
salen por rangos de azure, no por tu IP de casa.

permisos mínimos para desplegar:

| tipo | permiso |
|---|---|
| Account | Workers Scripts:Edit |
| Account | Account Settings:Read |

**estado actual:** se está usando el mismo token que para trabajo local, que
además trae `Workers R2 Storage:Edit`, `DNS:Edit` y `Cache Purge`. Funciona,
pero le da a CI más alcance del necesario: si el token se filtrara desde
Actions, alcanzaría para tocar el DNS de `vondiego.com` o borrar el bucket.

Si algún día querés apretar eso, hacé un token nuevo solo con los dos
permisos de la tabla y reemplazá el secret. El deploy no necesita nada más.

## subir media a r2

`rclone` configurado por variables de entorno, sin escribir secretos a disco:

```bash
set -a; . ~/.config/cloudflare/portfolio.env; set +a
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_R2_ENDPOINT="https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_REGION=auto

rclone copy ./videos r2:museo/videos \
  --header-upload "Cache-Control: public, max-age=31536000, immutable" \
  --transfers 4 --progress
```

verificar:

```bash
rclone size r2:museo
rclone ls r2:museo/videos
```

## fotos nuevas y sus derivados

Ningún navegador baja el original de una foto para pintarla. Cada foto sale en
un `<picture>` (`src/components/Foto.astro`):

| qué | dónde | quién lo baja |
|---|---|---|
| AVIF a 400, 640, 800, 1080, 1280, 1600, 1920 y 2560 px, más el ancho nativo | `avif/w<N>/projects/<rollo>/<pieza>.avif` | casi todos: Chrome, Firefox, Safari 16 o más nuevo |
| respaldo a 400, 800 y 1600 px en el formato del original | `w<N>/projects/<rollo>/<pieza>.jpg` | sólo un navegador sin AVIF |
| el original | `projects/<rollo>/<pieza>.jpg` | quien lo abre a propósito |

El navegador elige el escalón según el ancho al que se pinta la foto (`sizes`)
y la densidad de la pantalla. Nunca hay escalones más grandes que el original.

El AVIF va en 4:2:0 a calidad 66. Calibrado contra el JPEG de respaldo en doce
piezas del archivo, queda igual o arriba en luz y color con una cuarta parte
menos de peso a 800 px, y mucho menos a anchos grandes. No hay WebP: con la
misma métrica que el JPEG pesa 16% menos, pero aplana la textura de tela y
pelo, y para conservarla tiene que pesar más que el JPEG.

Al agregar un rollo:

```bash
# 1. subir los originales a R2, como siempre
rclone copy ./rollo-nuevo r2:museo/projects/rollo-nuevo \
  --s3-no-check-bucket --metadata \
  --metadata-set 'cache-control=public, max-age=31536000, immutable'

# 2. tenerlos en local, donde el sandbox de npm los ve
rclone copy r2:museo/projects .cache/media/projects
rclone copy r2:museo/posters .cache/media/posters
rclone copy r2:museo/video-posters .cache/media/video-posters

# 3. generar derivados y medidas (sólo procesa lo nuevo)
node scripts/derivados.mjs

# 4. subir lo que imprime al final: w400/, w800/, w1600/ y avif/
#    (sólo agrega; no toca originales)

# 5. comprobar que no falte nada y publicar
npm run revisar-derivados
git add src/data/medidas.json src/content/projects/rollo-nuevo.md
git commit -m "agregar rollo nuevo" && git push
```

`src/data/medidas.json` es la lista de lo que tiene derivados: si una pieza no
está ahí, se pinta con su original y sin `<picture>`, que es lento pero no se
rompe. Lo que sí rompe la foto es lo contrario: que `medidas.json` la anuncie y
su AVIF no esté en R2, porque un `<picture>` no cae al respaldo cuando el AVIF
da 404. Por eso CI corre `npm run revisar-derivados` antes de desplegar y se
detiene si falta un solo archivo.

## qué despliega un `git push` (y qué no)

**Un push a `main` despliega el sitio. NO despliega la media.**

| cambias | qué haces | listo en |
|---|---|---|
| código, diseño, CSS | commit + push | ~2 min |
| texto de un proyecto (`src/content/`) | commit + push | ~2 min |
| catálogo de cintas (`src/data/videos.ts`) | commit + push | ~2 min |
| **un video** | **subir a R2 con `rclone`** | inmediato |
| **una foto** | **subir a R2, correr `derivados.mjs` y subir sus derivados** ([ver arriba](#fotos-nuevas-y-sus-derivados)) | inmediato en R2, ~2 min el sitio |

La media no está en git y nunca pasa por GitHub Actions. Vive en R2 y se
sube aparte. Un flujo típico al agregar una cinta nueva:

```bash
# 1. subir el archivo a R2
rclone copy ./cinta-nueva.mp4 r2:museo/videos \
  --header-upload "Cache-Control: public, max-age=31536000, immutable"

# 2. registrarla en el catálogo
$EDITOR src/data/videos.ts     # src: '/media/videos/cinta-nueva.mp4'

# 3. publicar
git add -A && git commit -m "agregar cinta nueva" && git push
```

Si te saltas el paso 1, el sitio va a apuntar a un archivo que no existe (404).
Si te saltas el paso 3, el archivo está en R2 pero nadie lo ve.

### los secrets de CI

El deploy automático necesita dos secrets en
Settings → Secrets and variables → Actions:

| secret | valor |
|---|---|
| `CLOUDFLARE_API_TOKEN` | un token **sin filtro de IP** |
| `CLOUDFLARE_ACCOUNT_ID` | lo saca el dashboard: Workers & Pages → Overview, columna derecha |

**Ya están puestos** (sept 2026). Ver la nota de alcance del token en
"deploy automático" más arriba.

Para desplegar a mano sin pasar por CI:

```bash
set -a; . ~/.config/cloudflare/portfolio.env; set +a
npm run build && npx wrangler@4.129.0 deploy
```

## costos

### quién puede cobrar

**Workers no.** El worker no tiene script, solo sirve archivos estáticos, y
las peticiones a static assets son gratis e ilimitadas.

**R2 sí**, en teoría. Tres medidores:

| medidor | qué cuenta | gratis al mes | después |
|---|---|---|---|
| almacenamiento | lo que hay en el bucket | 10 GB | $0.015/GB |
| Clase A | escrituras: subir, borrar, listar | 1 millón | $4.50/M |
| Clase B | lecturas: bajar un archivo | 10 millones | $0.36/M |
| egress | ancho de banda de salida | **siempre $0** | — |

### dónde estamos (migración inicial, sept 2026)

- **almacenamiento:** 1.4 GB de 10 GB — 14%
- **Clase A:** 252 operaciones de 1,000,000 — las subidas de la migración
- **Clase B:** ~250 de 10,000,000

### por qué Clase B no escala con las visitas

Una lectura solo cuenta **si Cloudflare no tiene el archivo en caché**. Todo
se sirve con `immutable` y un año de TTL, así que el primer visitante de cada
PoP provoca una lectura a R2 y los siguientes salen del edge.

Verificable en cualquier momento:

```bash
curl -sI https://media.vondiego.com/posters/apice.webp | grep cf-cache-status
# cf-cache-status: HIT  → esa petición NO tocó R2
```

Con ~250 archivos, aunque cada PoP de Cloudflare pidiera cada uno, serían
decenas de miles de operaciones. El límite son diez millones.

### qué tendría que pasar para pagar algo

- **almacenamiento:** multiplicar la librería de video por 7
- **Clase A:** resubir el archivo completo ~4,000 veces en un mes
- **Clase B:** 10 millones de cache misses

### vigilancia

- alertas: dashboard → Manage Account → Notifications → Add → R2
- consumo en vivo: R2 → `museo` → Metrics

Poner una alerta al 80% del free tier de almacenamiento es suficiente: es el
único medidor que puede moverse de verdad, y solo subiendo mucho video.

### el costo que no es dinero

Cada subida de media sale por tu uplink de casa. Los 1.4 GB iniciales
tardaron. Tenlo en cuenta antes de subir una tanda grande.

## cache-bust

la media se sirve con `immutable` y cache de un año. si reemplazás un
archivo con el mismo nombre, el edge va a seguir sirviendo el viejo.

dos salidas:

1. **nombre nuevo** (preferido): `parto-v2.mp4` y apuntar el contenido ahí.
2. **query string**: `?v=20260617-2034`, como ya hace `presentacion-nave.mp4`.
3. **purga**: dashboard → Caching → Purge, o por API con el permiso
   `Cache Purge:Purge`.

## rollback

si el sitio en Workers se rompe y necesitás volver al stack de docker:

1. en el dashboard del tunnel, volver a agregar el public hostname
   `www.vondiego.com` → `http://localhost:30303`
2. eso recrea el CNAME de `www` al tunnel y desplaza al worker

el host docker sigue corriendo con `deploy/museo.compose.yaml`. ojo: la
imagen que jala es `ghcr.io/donutinit/museo:latest`, y el workflow ya
no publica imágenes docker — así que serviría la última construida antes
de la migración.

## troubleshooting

- **el sitio no actualiza tras un push**: revisar la corrida en Actions.
  si falla en `deploy`, casi siempre es el token (expirado o IP-locked).
- **404 en media**: verificar que el objeto exista con `rclone ls r2:museo/...`.
  el path del sitio `/media/x/y.jpg` corresponde a la key `x/y.jpg` en R2.
- **el video no hace scrub**: R2 manda `Accept-Ranges` solo, pero verificar
  que el mp4 tenga `faststart` (el atom `moov` antes de `mdat`):
  ```bash
  grep -abo -m1 moov video.mp4   # debe salir ANTES que:
  grep -abo -m1 mdat video.mp4
  ```
- **headers o redirects no aplican**: `_headers` y `_redirects` viven en
  `public/`. confirmá que llegaron a `dist/` después del build.
