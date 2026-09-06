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
