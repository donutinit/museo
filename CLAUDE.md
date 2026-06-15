# instrucciones para claude code

## estilo de commits

- **siempre one-liners**, ~72 chars máximo
- **todo en minúsculas**
- **prohibido**: `co-authored-by:` y cualquier otro trailer al final del mensaje
- ejemplos ok:
  - `agregar workflow de github actions para build de astro`
  - `mover diagrama de arquitectura a docs/00-arquitectura.md`
  - `fix: range requests en nginx.conf para video seeking`
- ejemplos no:
  - `Agregar workflow` (mayúscula inicial)
  - `agregar workflow\n\nblah blah` (multi-línea)
  - cualquier cosa con `Co-Authored-By` o `Signed-off-by` al final

razón: al donut no le gusta cómo se lee el trailer; prefiere atribución por otro mecanismo (ver más abajo).

## atribución de claude

en lugar de trailers en commits, el donut prefiere agregar a claude como **contributor** del repo. opciones:

- agregarlo en `package.json` cuando exista (`"contributors": [{"name": "claude code", "email": "..."}]`)
- mantener este archivo (`CLAUDE.md`) como reconocimiento explícito de que claude colaboró
- agregar sección "credits" en el sitio si aplica

## lenguaje

- español mexicano, registro casual
- groserías ok cuando vienen al caso (el donut las usa naturalmente)
- evitar formalismo innecesario

## proyecto

portafolio del **donut** (videógrafo/fotógrafo).

- **stack**: astro (probablemente con tailwind), nginx en docker, deploy a truenas community edition
- **infra**: imagen en ghcr.io (pública), cloudflare tunnel para exposición, dominio en cloudflare
- **dirección visual**: brutalismo/experimental — pendiente sabor exacto (ver `docs/05-direccion-visual.md`)
- **contenido**: reels, fotografía editorial, eventos, behind-the-scenes

ver `docs/` para detalle completo.

## sobre los nombres

- github user: `donutinit`
- email: `contacto@vondiego.com`
- nombre para licencia/créditos: `donut init`
