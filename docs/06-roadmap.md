# roadmap

## hecho

- [x] elección de stack (astro + nginx + ghcr + cloudflare tunnel)
- [x] repo creado y clonado localmente (`~/src/portfolio`)
- [x] licencia [hlqsthuhalv](../LICENSE)
- [x] docs base (los 7 archivos en este directorio)
- [x] `.gitignore` configurado para astro + media pesada
- [x] `CLAUDE.md` con instrucciones de estilo (commits one-liner, etc)
- [x] git + ssh funcionando contra github

## bloqueado, esperando a Von Diego

- [ ] **decidir sabor brutalista** (ver [05-direccion-visual.md](./05-direccion-visual.md)) — bloquea tipografía, paleta, layout
- [ ] **decidir dominio/subdominio final** — bloquea config de cloudflare tunnel

## en cola

orden tentativo una vez se desbloquee:

1. **scaffold del proyecto astro**
   - `npm create astro` con template minimal
   - estructura de carpetas: `src/pages/`, `src/components/`, `src/layouts/`, `src/content/projects/`
   - tailwind o vanilla css (decidir junto con el sabor)

2. **dockerfile multi-stage**
   - stage 1: node → `npm ci && npm run build`
   - stage 2: nginx alpine → copia `/dist`
   - `nginx.conf` custom con range requests habilitado para video y headers de caché

3. **github actions workflow**
   - `.github/workflows/build.yml`
   - trigger: push a `main`
   - jobs: checkout → setup node → build → docker buildx → push a ghcr

4. **layout base + sistema tipográfico** (depende del sabor elegido)

5. **componente: video player custom**
   - controles a medida según el sabor
   - range requests, scrub, fullscreen
   - poster image antes del play

6. **componente: photo gallery**
   - lightbox custom
   - lazy loading
   - responsive (astro `<Image>`)

7. **content collection: projects**
   - schema en `src/content/config.ts`
   - cada proyecto = un `.md` con frontmatter (título, fecha, tipo, hero, reels, fotos)

8. **páginas: index / project / about / contact**

9. **build + push primera versión → ghcr**

10. **deploy en truenas + cloudflare tunnel**

11. **encoding pipeline para reels** — script `ffmpeg` local que prepara los archivos antes de subirlos al nas

12. **opcional: cms ligero** (decap o sveltia) si en algún momento el flujo de `git commit` se vuelve cansado

## ideas / backlog (sin orden)

- view transitions api para navegación cinematográfica entre proyectos
- modo "contact sheet" para fotografía (estilo hoja de contactos de fotógrafo análogo)
- modo "shot list" para video (overlay con datos técnicos: cámara, lente, iso, fps)
- pdf descargable con press kit / one-sheet por proyecto
- analytics privados (umami o plausible self-hosted en truenas — sin google, sin cookies)
- og:image dinámicas por proyecto (importante para compartir en redes)
- rss feed de "novedades" para clientes que quieran subscribirse
- modo "behind-the-scenes" como sub-galería por proyecto
- 404 con personalidad (en línea con el sabor visual elegido)
