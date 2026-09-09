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
- No hagas commits con trailers tipo `Co-Authored-By`.

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
