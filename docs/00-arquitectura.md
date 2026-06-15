# arquitectura

## panorama general

```
github                          truenas                      cloudflare
─────────                       ──────────                   ──────────
repo: portfolio                 ┌─ app: portfolio ─┐         ┌─ dns ─┐
  ├ src/ (astro)                │ nginx container  │◄──┐     │ tudominio.com
  ├ dockerfile          ──►     │ sirve /dist/     │   │     └───┬───┘
  └ .github/workflows/          │ + /media (mount) │   │         │
     └ build.yml                └──────────────────┘   │     ┌───▼──────┐
        │                              ▲              └─────┤ tunnel   │
        │ on push:                     │ pull image         │ cloudflared
        ▼                              │                    └──────────┘
   gha: npm run build             ┌────┴────┐
   → docker build                 │  ghcr   │ ghcr.io/donutinit/portfolio
   → docker push     ────────────►│ registry│
                                  └─────────┘

   /mnt/tank/portfolio-media/  ← dataset separado, montado en el container
     ├ reels/*.mp4              (subís por smb/sftp, sin rebuild)
     └ photos/*.webp
```

## componentes

### 1. github repo (este)

fuente de verdad del sitio. todo lo que termina en producción empieza acá. `git push` dispara el resto del pipeline.

### 2. github actions (gha)

ci/cd. en cada push a `main`:

1. `npm ci && npm run build` → genera `dist/` con html/css/js estático
2. `docker build` → mete el `dist/` adentro de una imagen con nginx
3. `docker push ghcr.io/donutinit/portfolio:latest` → publica al registry

usa el `GITHUB_TOKEN` que actions inyecta automáticamente, sin pat manual.

### 3. ghcr (github container registry)

hospeda la imagen docker. gratis e ilimitado para repos públicos. la imagen es pública (no contiene secretos, solo el sitio compilado).

### 4. truenas — custom app: `portfolio-web`

container nginx pulleado desde ghcr. sirve dos cosas:

- el sitio estático (que viene dentro de la imagen)
- los assets pesados (montados desde un dataset separado, ver punto 5)

### 5. truenas — dataset: `portfolio-media`

```
/mnt/tank/portfolio-media/
├ reels/         ← videos web-optimizados (mp4 h.264 con faststart)
├ photos/        ← fotos (webp generadas; los raws viven en otro dataset)
├ thumbnails/    ← posters de los reels (jpg ~100kb)
└ documents/     ← cv, press kit, etc (si aplica)
```

actualizar contenido = copiar archivos al dataset vía smb/sftp. **sin rebuild, sin redeploy, sin commit.** el sitio los encuentra al instante.

### 6. truenas — custom app: `cloudflared`

container con el demonio de cloudflare tunnel. expone `portfolio-web:80` al edge de cloudflare. cero port-forwarding, cero certs ssl, cero ip pública necesaria.

### 7. cloudflare

- dns del dominio
- el otro extremo del tunnel
- caché del cdn (assets se cachean en cloudflare automáticamente)
- waf opcional del plan free

## flujo de updates

| qué cambia | qué hacés | tiempo |
|---|---|---|
| diseño/código | edit + `git push` | ~3 min (build gha + pull) |
| nuevo reel/foto | scp/smb al dataset | instantáneo |
| nuevo proyecto (texto + media) | edit md + `git push` + subir media | ~3 min |
| versión de astro o deps | `npm update` + push | ~3 min |

## decisiones de diseño relevantes

- **build en gha, no en truenas**: el nas no es build server. gha tiene 2000 min/mes gratis, sobra de sobra.
- **media fuera del repo**: los archivos pesados no van a git. viven en el dataset de truenas. esto mantiene el repo liviano (clones rápidos) y permite actualizar contenido sin redeploy.
- **imagen docker pública**: cero secretos adentro, no hay razón para sumar fricción de auth.
- **un solo nginx para html + media**: simplicidad. mismo container sirve todo. si el día de mañana crece muchísimo, separamos.

el *por qué* de cada elección vive en [01-decisiones-tecnicas](./01-decisiones-tecnicas.md).
