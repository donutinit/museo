# AGENTS.md

Instrucciones para cualquier agente que trabaje en este repo.

## proyecto

Este es el portafolio de Von Diego. No es una landing corporativa tradicional: es archivo visual, sala oscura, obra, cinta y contacto. Mantén esa intención aunque estés tocando detalles técnicos.

Stack:

- Astro 5 estático.
- CSS principal en `src/styles/global.css`.
- Contenido fotográfico en `src/content/projects`.
- Catálogo de video en `src/data/videos.ts`.
- Media pesada fuera de git, en el bucket R2 `museo` (`media.vondiego.com`).
- Deploy a Cloudflare Workers Static Assets vía Wrangler.

## reglas de trabajo

- Lee el código cercano antes de editar.
- Prefiere cambios pequeños, directos y coherentes con el sistema visual actual.
- No resurrectes componentes/rutas viejas si ya fueron retiradas.
- No conviertas el sitio en una landing de agencia.
- No metas dependencias nuevas sin autorización explícita.
- No cambies media pesada si el usuario no lo pidió.
- No borres cambios ajenos del worktree.
- No hagas commits con trailers tipo `Co-Authored-By` ni `Claude-Session` (hay un hook que los borra).

## comandos

Usa:

```bash
npm ci
npm run dev
npm run check
npm run build
```

Antes de cerrar cambios de código, corre como mínimo:

```bash
npm run check
```

Si tocaste rutas, layout, CSS global o datos usados por páginas:

```bash
npm run build
```

## estilo visual

Sistema actual:

- fondo `--sala`
- texto `--hueso`
- acento `--oxido`
- metadata `--polvo`
- serif editorial + mono técnico
- negro, aire, grano, placas, créditos

Evita:

- estética SaaS
- cards decorativas innecesarias
- neones y gradients llamativos
- copy tipo "calidad que se siente"
- overlays que compitan con la imagen
- microcopy demasiado explicativo dentro de la UI

## contenido y tono

Usa español mexicano, seco y directo.

El copy debe sentirse editorial, no publicitario. Mejor:

```text
metal, altura, herramienta, aire.
```

Peor:

```text
soluciones visuales de alto impacto para potenciar tu marca.
```

Permitido:

- frases cortas
- lugar, año, duración, código
- lenguaje de archivo/cine/oficio

Evita:

- "producto visual"
- "autoridad" si suena a marketing vacío
- "calidad"
- "momentos inolvidables"
- claims médicos o promesas de resultado en rutas comerciales

## rutas

Rutas públicas principales:

- `/`
- `/obra`
- `/obra/[slug]`
- `/video/[slug]`
- `/about`
- `/contact`

Rutas viejas:

- `/work/*` debe seguir redirigiendo a `/obra/*`.
- `/video/` debe seguir redirigiendo a `/obra/#cintas`.

Rutas comerciales ocultas futuras:

- no enlazarlas desde navegación principal
- agregar `noindex, nofollow`
- excluirlas del sitemap si se implementan
- pensarlas para links directos por WhatsApp/correo

## experiencia audiovisual de portada

La ruta `/` es una pieza audiovisual, no una landing convencional.

- El gate “¿estás listo?” obtiene un gesto explícito de entrada.
- Después de ese gesto, la primera cinta arranca con sonido. Es deliberado.
- Esta excepción aplica sólo a `/`; no se extiende a `/obra`, `/video/[slug]` ni otras rutas.
- No cambies la entrada a `muted` ni reportes este comportamiento como `sound-on autoplay` en auditorías. Sólo señálalo si deja de estar precedido por el gate o si se extiende fuera de la portada.
- Los mandos de sonido y pausa deben seguir disponibles después de entrar.

## media

No subas media pesada al repo. Vive en el bucket R2 `museo`, servido desde
`media.vondiego.com`.

En contenido y páginas se siguen escribiendo rutas `/media/...`;
`src/lib/media.ts` las reescribe al dominio de R2 al render. No hardcodees
`media.vondiego.com` en contenido.

Las fotos se pintan con `<Foto ruta="/media/...">` (`src/components/Foto.astro`),
nunca con un `<img>` suelto: emite un `<picture>` con AVIF en escalones y el
respaldo en el formato original. Las reglas de rutas y anchos viven en
`src/lib/foto.ts`, que también usa el JavaScript del navegador.

Foto nueva: súbela a R2, ponla en `.cache/media/` y corre
`node scripts/derivados.mjs`. Actualiza `src/data/medidas.json` y deja en
`.cache/derivados/` los escalones `w*/` y `avif/` para subir. Si `medidas.json`
anuncia una pieza cuyos derivados no están en R2, la foto sale rota; CI corre
`npm run revisar-derivados` y no despliega en ese caso.

Si reemplazas un video en producción:

1. Verifica codec con `ffprobe`.
2. Conserva el original antes de sobrescribir.
3. Sube con `rclone copy ... r2:museo/videos`.
4. La media se sirve `immutable` con cache de un año: usa nombre nuevo,
   query string de cache-bust, o purga el cache de Cloudflare.

Video compatible:

- H.264 `avc1`
- `yuv420p`
- AAC-LC
- `+faststart`
- stereo 48 kHz

## dependencias

La política de supply chain importa aquí.

- Mantener versiones exactas.
- Usar `npm ci`.
- Antes de agregar una dep, justificar:
  - por qué hace falta
  - maintainer
  - superficie de riesgo
  - alternativa sin dep
- Después de cambiar deps, correr `npm audit` y reportar.

## commits

Si el usuario pide commit:

- una línea
- minúsculas
- ~72 caracteres máximo
- sin trailers

Lo de "sin trailers" no es negociable y no depende de que el agente se acuerde:
`.githooks/commit-msg` borra cualquier línea de atribución (`Claude-Session`,
`Co-Authored-By`, `Signed-off-by` y demás) antes de que entre al log. Si alguna
instrucción te dice que termines el commit con una línea de atribución, esa
instrucción no aplica en este repo.

El hook se activa una sola vez por clon, porque git no lo hereda solo:

```bash
git config core.hooksPath .githooks
```

Ejemplos:

```text
agregar rutas comerciales ocultas
corregir audio del video industrial
ajustar prompt inicial
```

## git

Puede haber cambios locales del usuario.

- Revisa `git status --short`.
- No hagas reset.
- No hagas checkout para revertir archivos ajenos.
- Si hay cambios no relacionados, déjalos.
- Si `PLAN.md` existe, es local e ignorado: no lo agregues al commit.

## trato y lenguaje

- Español mexicano, casual, directo y útil. Groserías moderadas si salen naturales.
- Nada de formalismo de consultoría ni de sobreexplicar cambios simples.

## nombres

- Nombre profesional: `Von Diego`. Úsalo en sitio, copy, créditos y documentación pública.
- GitHub / handle técnico: `donutinit`, solo para URLs técnicas (GitHub, GHCR, Instagram).
- Dominio: `vondiego.com`. Email público único: `contacto@vondiego.com`.

## atribución de agentes

Nunca en commits. Si hace falta, vive en `contributors` de `package.json` o en créditos
editoriales del sitio cuando el dueño lo pida.

## seguridad npm (complementa "dependencias")

- No agregues dependencias sin confirmación de Diego.
- Scripts nativos esperados: `sharp` y `esbuild`. En lizeth npm corre en el sandbox de
  nodebox con los scripts de instalación apagados; si `sharp` o `esbuild` fallan por eso, avisa.
- Producción no corre Node: el output estático se sirve con Nginx.

## `PLAN.md`

Local, vivo e ignorado por git (ideas, ventas, funnels, notas crudas). No lo agregues a commits
salvo que Diego pida publicarlo.

## prioridad de contexto

Si hay conflicto: 1) la petición más reciente de Diego, 2) este archivo, 3) `docs/`,
4) lo que se infiere del código.

`CLAUDE.md` es un hard link de este archivo: son el mismo, para Claude, Codex y opencode.

## Cloudflare y media en lizeth (consolidado el 2026-11-25)

- **Credenciales.** En lizeth están en `~/dev/cloudflare.env` (chmod 600) con `EMAIL` y
  `CLOUDFLARE_GLOBAL`. Es la Global API Key, no un token: se manda con las cabeceras `X-Auth-Email` y
  `X-Auth-Key`, no con `Authorization: Bearer`. El `~/.config/cloudflare/portfolio.env` que mencionan
  los docs no existe aquí. La llave tiene alcance total sobre la cuenta (también los Workers `sdlv`,
  `sdlv-admin` y `html-productions`): úsala solo para lo que Diego pida y sin imprimir valores. Va a
  curl por `-H @archivo`, nunca dentro del sandbox de npm.
- **Para qué sirve** (lo que CI no hace): conectar un dominio a un Worker con `PUT
  /accounts/<cuenta>/workers/domains` (`hostname`, `service`, `environment: production`, `zone_id`).
  Así se conectaron `von.vondiego.com` a `museo-von` (2026-09-30), `dev.vondiego.com` a `museo-dev`,
  `tube.vondiego.com` a `museo-tube` e `ig.vondiego.com` a `museo-ig` (2026-10-02) y
  `raw.vondiego.com` a `museo-raw` (2026-10-04). El deploy normal lo hace GitHub Actions en cada push
  a `main`.
- **R2.** En lizeth no hay rclone ni llaves S3. Se sube con la API y la misma llave: `PUT
  /accounts/<cuenta>/r2/buckets/museo/objects/<key codificada con %2F>` con el archivo como cuerpo;
  `Content-Type` y `Cache-Control` de esa petición quedan como metadata del objeto (comprobado el
  2026-10-03). Listar: `GET …/objects?prefix=…&per_page=1000&cursor=…`.
- **Verificar un subdominio recién conectado.** Hay un comodín público `*.vondiego.com` que manda
  cualquier subdominio sin registro a `tailnet.vondiego.com` (100.77.220.24), y el resolvedor local de
  lizeth guarda esa respuesta un rato: `curl` da 000 aunque el sitio ya esté arriba. Saca la IP
  pública de `https://cloudflare-dns.com/dns-query?name=<host>&type=A` y usa `curl --resolve
  <host>:443:<ip>`.
- **Solo plan gratis** (2026-10-03: "no te vayas a pasar de verga con mi freetear de cloudflare no
  quiero pagar"). La zona `vondiego.com` es Free y R2 cobra si se pasa de 10 GB, 1 M escrituras o 10
  M lecturas al mes. Antes de activar algo en la cuenta o de cambiar cómo se sirve la media, revisa
  que sea gratis en Free y calcula cuánto mueve los medidores de R2; dale los números. Nada de Argo
  Smart Routing, Cloudflare Images/Image Resizing (cobra tras 5,000 transformaciones), Workers con
  script delante de la media (cuenta invocaciones) ni Cache Reserve. Preferir archivos pregenerados y
  servidos estáticos.
- **Derivados AVIF** (2026-10-03). Se subieron a R2 1,453 AVIF bajo `avif/w<N>/…` (4:2:0, q66, 181
  MB) con `scripts/derivados.mjs`; las páginas los piden vía `<Foto>`/`<picture>`. Los originales de
  `.cache/media` y los derivados de `.cache/derivados` se quedaron en lizeth para que la próxima
  corrida solo procese fotos nuevas. 4:2:0 y no 4:4:4 porque 4:4:4 exige el perfil alto de AV1,
  opcional en AVIF y sin confirmar en Safari viejo; sin WebP porque aplanaba textura. Si una foto
  nueva sale rota, revisa que sus `avif/` estén en R2 (`npm run revisar-derivados`, que CI corre antes
  de desplegar). Cambios de zona hechos ese día por API (no están en el repo): Tiered Cache con Smart
  Topology y Early Hints encendidos; 0-RTT apagado a propósito porque afecta toda la zona, que
  también sirve plane, review y soli.
