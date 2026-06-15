# decisiones técnicas

resumen del *por qué* atrás de cada elección. si algo no se entiende del [diagrama de arquitectura](./00-arquitectura.md), acá está la justificación.

## stack del sitio

### ¿astro y no wordpress?

| | wordpress | astro |
|---|---|---|
| performance | lento por defecto, requiere caché agresivo | rápido por defecto, html estático |
| superficie de ataque | alta (php + db + plugins) | mínima (html estático servido por nginx) |
| mantenimiento | actualizar core + plugins constantemente | actualizar deps cuando rebuildeas |
| editar contenido | editor visual cómodo | requiere `git commit` |
| ideal para | blog con muchos editores | portafolio donde valoras velocidad + control |
| recursos en truenas | mariadb + php-fpm + nginx, ~600 mb | solo nginx, ~20 mb |

**veredicto**: astro. el portafolio se actualiza cada par de meses, no diariamente. el costo de hacer `git commit` para agregar un proyecto es bajísimo comparado con el beneficio de un sitio que carga al instante y no requiere parches de seguridad mensuales.

### ¿por qué astro y no otro ssg?

- **next.js**: overkill, runtime de react que no necesitamos para un portafolio mayormente estático
- **sveltekit**: opción legítima pero astro tiene mejor optimización de imágenes nativa, importante para foto/video
- **eleventy**: bueno pero menos componentizado, más fricción para reutilizar bloques visuales
- **hugo**: rápido pero golang templates son menos placenteros que jsx/svelte
- **astro**: zero js por defecto, image component con sharp, view transitions api, islands architecture si necesitamos react/svelte puntual

## registry: ghcr vs alternativas

| | ghcr | docker hub | self-hosted (`registry:2`) |
|---|---|---|---|
| costo (público) | gratis | gratis | infra propia |
| rate limit pulls | sin límite | 100 pulls / 6h anon | propio |
| integración con gha | nativa | requiere secrets | manual |
| latencia desde truenas | global cdn | global cdn | local (rapidísimo) |

**veredicto**: ghcr. gratis, sin rate limits, integración cero-config con github actions vía `GITHUB_TOKEN` automático.

## video: hosting y player

### ¿self-host o cloudflare stream?

opciones evaluadas:

- **cloudflare stream**: ~$5/mes por 1000 min almacenados. encoding hls automático, abr, player profesional. ideal para muchos reels o tráfico alto.
- **vimeo embed**: depende de su player, marca propia, planes pagados para hd sin watermark.
- **youtube embed**: gratis pero branding de youtube ineludible. mata el aesthetic brutalist.
- **self-host en truenas**: control total, cero costo recurrente. requiere encoding propio y player custom.

**veredicto**: self-host con custom player. razones:

1. el aesthetic brutalist requiere player propio (controles a medida, no de un tercero)
2. el donut ya sabe que el archivo se sirve bien desde el nas (referencia: el flujo "vitransfer" que tiene corriendo)
3. cero dependencia externa
4. con archivos web-optimizados (h.264 + faststart, ~50-150 mb por reel de 2-3 min) el ancho de banda no es problema

### encoding recomendado para los reels

para cada reel masterizado:

```bash
ffmpeg -i master.mov \
  -c:v libx264 -preset slow -crf 22 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  output-web.mp4
```

- `crf 22`: buena calidad sin archivos enormes (bajalo a 20 si querés mejor cal, subilo a 26 si querés menor peso)
- `faststart`: mueve el moov atom al principio del archivo → empieza a reproducirse al instante
- `yuv420p`: compatibilidad universal de browsers/dispositivos
- `preset slow`: encoding más lento pero archivo final más chico

opcional: generar variantes adaptive con hls (`-hls_time 4 -hls_playlist_type vod`) si queremos calidad ajustable a la conexión.

### player

decidido construirlo a medida, en línea con el aesthetic brutalist. base técnica: `<video>` html5 nativo + controles css/js custom. opciones de librerías base si no queremos partir de cero:

- **vidstack**: moderna, web-components, full custom
- **plyr**: ligera, fácil de re-skinear
- **video.js**: clásica, pesada, sobrada para esto

probablemente arrancamos desde cero con `<video>` y construímos los controles. el set mínimo: play/pause, scrub, mute, fullscreen, opcional picker de calidad si hacemos hls.

## visibilidad de la imagen docker: pública

el repo es público, la imagen también. justificación: la imagen contiene solo el html/css/js compilado (lo mismo que cualquier visitante ve con f12). no hay secretos. hacerla privada solo agrega fricción (pat, rotación, gestión de credentials en truenas).

## exposición: cloudflare tunnel vs port-forwarding

descartado port-forwarding por:

- requiere ip pública estática o ddns
- expone el ip público del isp del donut
- requiere lets-encrypt o cert manual + renovación
- pierde la red de cloudflare (waf, cdn, anti-ddos)

cloudflare tunnel:

- conexión saliente desde el nas hacia cloudflare (cero puertos abiertos)
- https automático
- ip del nas nunca expuesta
- cdn + waf gratis del plan free
- soporta múltiples hostnames bajo el mismo tunnel
