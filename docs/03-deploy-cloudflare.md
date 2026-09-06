# deploy en cloudflare

el sitio se sirve desde Workers Static Assets; la media desde un bucket R2.

## piezas

| pieza | nombre | hostname |
|---|---|---|
| worker | `museo` | `www.vondiego.com` |
| bucket r2 | `museo` | `media.vondiego.com` |

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
salen por rangos de azure, no por tu IP de casa. si usás un token
IP-locked para trabajo local, hacé uno aparte para CI.

permisos mínimos del token:

| tipo | permiso |
|---|---|
| Account | Workers Scripts:Edit |
| Account | Account Settings:Read |

(para tocar R2 y DNS hace falta además `Workers R2 Storage:Edit` y
`Zone → DNS:Edit`, pero el deploy del sitio no los necesita.)

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

## qué despliega un `git push` (y qué no)

**Un push a `main` despliega el sitio. NO despliega la media.**

| cambias | qué haces | listo en |
|---|---|---|
| código, diseño, CSS | commit + push | ~2 min |
| texto de un proyecto (`src/content/`) | commit + push | ~2 min |
| catálogo de cintas (`src/data/videos.ts`) | commit + push | ~2 min |
| **una foto o un video** | **subir a R2 con `rclone`** | inmediato |

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

### requisito pendiente para que el push despliegue solo

El workflow existe pero **falla en el paso de deploy hasta que agregues dos
secrets** en Settings → Secrets and variables → Actions:

| secret | valor |
|---|---|
| `CLOUDFLARE_API_TOKEN` | un token **sin filtro de IP** |
| `CLOUDFLARE_ACCOUNT_ID` | `<account-id-redactado>` |

El token de uso local está restringido por IP y los runners de GitHub salen
por rangos de Azure, así que **no sirve el mismo**. Hacé uno nuevo con
`Workers Scripts:Edit` + `Account Settings:Read` y sin restricción de IP.

Mientras tanto, para desplegar a mano:

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
