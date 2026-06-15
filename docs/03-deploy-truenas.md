# deploy en truenas

versión actual de truenas community edition (ex scale) usa docker compose como backend (post-electric eel). esto cubre el flujo desde cero.

## prerequisitos

- truenas con docker apps habilitado
- al menos un dataset disponible para media (`/mnt/tank/portfolio-media/` o equivalente)
- dominio en cloudflare con tunnel ya configurado (ver [04-cloudflare-tunnel.md](./04-cloudflare-tunnel.md))

## pasos (cuando lleguemos acá)

### 1. crear datasets

en truenas ui → datasets → crear:

```
tank/portfolio-media/
  ├ reels/         (compresión: lz4 está bien — los mp4 ya están comprimidos)
  ├ photos/
  ├ thumbnails/
  └ posters/
```

permisos: usuario `apps` (el que corre los containers de truenas) con lectura.

### 2. crear custom app del sitio

apps → discover → custom app → pegar:

```yaml
services:
  portfolio:
    image: ghcr.io/donutinit/portfolio:latest
    container_name: portfolio-web
    restart: unless-stopped
    ports:
      - "8080:80"           # solo lan/interno, no expuesto
    volumes:
      - /mnt/tank/portfolio-media:/usr/share/nginx/html/media:ro
    networks:
      - portfolio-net

networks:
  portfolio-net:
    name: portfolio-net
```

### 3. setup del tunnel

ver [04-cloudflare-tunnel.md](./04-cloudflare-tunnel.md). el tunnel se configura para que `portfolio.tudominio.com` → `http://portfolio-web:80`.

ambos containers (`portfolio-web` y `cloudflared`) tienen que estar en la misma docker network (`portfolio-net`).

### 4. actualizar el sitio

dos rutas:

**a) auto-pull con watchtower**

agregar otro container `containrrr/watchtower` con label `com.centurylinklabs.watchtower.scope=portfolio` que cada x minutos pullea la última versión.

**b) manual (recomendado al principio)**

después de que gha termine: truenas ui → apps → portfolio → ⋮ → upgrade/pull. da más control para revertir si algo se rompe.

### 5. actualizar contenido

scp/smb al dataset:

```bash
scp reel-nuevo.mp4 truenas:/mnt/tank/portfolio-media/reels/
```

nginx lo encuentra al instante. el listado de proyectos (si es estático en `src/content/`) sí requiere `git push` para que aparezca el nuevo proyecto en el menú/index.

mejora a futuro: endpoint en el container que lea el dataset y genere el listado dinámicamente.

## troubleshooting

- **container no levanta**: revisar logs en truenas ui → apps → portfolio → logs. típicos: imagen no existe (mal nombre), permisos del volume mount, puerto en uso.
- **imagen no pullea**: si la hiciste privada, ver "credenciales de registry" en truenas ui → apps → settings.
- **404 en assets de media**: verificar que el dataset está montado y los archivos están donde el sitio los espera (path absoluto dentro del container = `/usr/share/nginx/html/media/...`).
- **video no hace scrub**: nginx necesita range requests habilitado. en el `nginx.conf` del container, asegurar que no estamos sirviendo con `gzip` los `.mp4` y que mandamos `Accept-Ranges: bytes`. con nginx default ya funciona.
