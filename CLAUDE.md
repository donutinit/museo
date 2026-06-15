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

archivo visual de **Von Diego** (artista visual).

- **stack**: astro (probablemente con tailwind), nginx en docker, deploy a truenas community edition
- **infra**: imagen en ghcr.io (pública), cloudflare tunnel para exposición, dominio en cloudflare
- **dirección visual**: brutalismo/experimental, techy e irracional
- **contenido**: productos visuales, archivo de obra, eventos, marca, arte y piezas personales

ver `docs/` para detalle completo.

## sobre los nombres

- **nombre profesional / display name**: `Von Diego` (úsalo siempre en sitio, copy, licencia, créditos)
- github user / handle: `donutinit` (solo para urls técnicas: github, ghcr, instagram)
- email personal: `contacto@vondiego.com`
- email comercial / pública: `contacto@vondiego.com`
- dominio: `vondiego.com`

## seguridad / supply chain de npm

el donut tiene preocupación legítima por ataques de supply chain en npm. reglas estrictas:

1. **versiones pineadas exactas** en `package.json` (sin `^` ni `~`) — para que `npm ci` produzca builds reproducibles
2. **siempre `npm ci`** (con lockfile), nunca `npm install` para builds
3. **solo deps de orgs reconocidos**: astro org, tailwind labs, vercel, microsoft, fontsource, lovell fuller (sharp). cualquier dep nueva: justificar maintainer + razón
4. **antes de agregar una dep nueva**: pedir confirmación al donut
5. **postinstall scripts**: verificar quién corre. esperados aquí: solo `sharp` (binarios nativos) y `esbuild` (binario nativo). cualquier otro = stop + revisar
6. **producción cero-node**: el build de astro genera html estático; nginx lo sirve. NO hay node corriendo en truenas
7. **builds en gha**, no en su máquina cuando sea posible — aísla el riesgo
8. **`npm audit`** después de cualquier cambio de deps, reportar resultados
