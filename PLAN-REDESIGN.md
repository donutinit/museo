# Redesign — "portafolio de director de autor"

> Branch: `redesign`. Doc de trabajo, editable. La estética anchor cambió de "monografía silenciosa" a **director de cine de autor: sofisticado, raro, difícil de entender pero que transmite mucho**.

---

## Diagnóstico de lo actual

El sitio se siente **landing page corporativa con barniz de arte**, no **portafolio de un autor**.

Síntomas:

- **Decoración encima de la obra**: tape labels, cortes diagonales, glitch shadows, REC blink, "EVIDENCIA · 03". Esa capa habla más fuerte que las imágenes.
- **Tipografía gritando**: Fraunces WONK + Rubik Glitch + Unbounded + Space Grotesk = 5 voces compitiendo, todo uppercase, sin descanso.
- **Paleta de startup**: `#ff4b12` + `#d8ff31` + `#19d8ff`. Eso es un dashboard SaaS, no una obra.
- **Jerarquía plana**: home, `/video`, `/work` y `/about` se sienten parecidas. Nada manda.
- **Copy de marketing**: "Producto visual con carácter", "la imagen necesita autoridad", "calidad que se siente". Squarespace energy.

---

## Anchor estético

**Referencias mentales** (para mí, mientras decido):

- Carlos Reygadas — *Post Tenebras Lux*, *Japón*. Grano cálido, luz mexicana, intimidad familiar, símbolos crípticos.
- Apichatpong Weerasethakul — *Uncle Boonmee*, *Memoria*. Quietud, plano largo, mística rural.
- Lynne Ramsay — *We Need to Talk About Kevin*. Texturas sucias, color sangrante, close-ups violentos.
- Lars Von Trier — Dogme95 + *Antichrist*. Reglas estrictas autoimpuestas, hand-held, créditos absolutos.
- Béla Tarr — *Werckmeister Harmonies*. Blanco y negro de óleo, planos secuencia.
- Andrei Tarkovsky — *El espejo*. Pintura, silencio, agua, archivo familiar.

Lo que une todo eso (y lo que el sitio tiene que copiar):
- **Silencio activo** — el espacio negro entre eventos *es* parte de la obra.
- **Imagen como verdad única** — la imagen no ilustra, *es*.
- **Ritmo lento** — el sitio se navega como una película se ve: no se hojea.
- **Codificación opaca** — fechas, números, frases cripticas. El visitante hace el trabajo de entender.
- **Emocionalidad oblicua** — no decís lo que sentís, mostrás la cosa hasta que se siente sola.

---

## Premisa

El sitio se siente **como ver una película de autor**: opening, plates, créditos. Hay un orden, pero no es obvio. Las cosas tienen nombre técnico, no comercial. La obra es íntima y se reserva. El visitante entra como espectador, no como cliente.

> Si entrás al sitio y la primera reacción no es "qué chingados es esto" seguido de "ah, me quedo", el rediseño falló.

---

## Principios

1. **Silencio cinematográfico.** Pantallas que casi no contienen UI. Negro real. Sin nav superior gritando. El nombre aparece como título de película, no como logotipo de empresa.
2. **La imagen es la película.** Las fotos y videos son planos. Se presentan a su pace, sin overlay, sin etiquetas técnicas en la cara.
3. **Tipografía de créditos.** Una sola voz dominante. Posible:
   - Serif old-style italic permanente (como una carta) — *raro, intenso*
   - O grotesk técnica condensada (como créditos finales) — *sobrio, severo*
   - Mono solo para fechas + duración + n.º — eso sí es identidad
4. **Paleta de sala oscura.** Negro real, hueso, un solo acento de óxido o sangre seca. Nada de neón, nada de tres acentos.
5. **Codificación.** Cada pieza tiene un código compuesto (`vd/26/04 · 1m 38s`). Eso reemplaza títulos en navegación. Los títulos largos se reservan para cuando hacés click.
6. **Movimiento mínimo, intencional.** Sin parallax barato, sin marquees, sin hover effects de juguete. Solo: fade entre estados, cut entre páginas, scroll lento sobre imagen.

---

## Sistema visual

### Tipografía

Decisión pendiente — recomiendo *dos voces* total:

**Opción A — Serif crítica + mono técnico** (favorita)
- `GT Sectra Display` italic (no libre) o `Bagnard` italic (libre) como **voz única** para títulos y citas
- `JetBrains Mono Variable` para metadata (n.º, año, duración, código)
- Italic permanente para los títulos da el carácter "manuscrito de un director"

**Opción B — Grotesk condensada + mono**
- `Söhne Schmal` (no libre) o `Inter Display` condensed (libre) en weight semibold para créditos
- `JetBrains Mono Variable` igual
- Da carácter "post-credits / film festival"

**Recomiendo A con Bagnard** (libre, fontsource disponible). El italic es el alma del proyecto. Confirmá.

### Paleta

```
--sala:    #07060a   (negro de sala oscura, casi azul)
--hueso:   #ddd2bb   (cream sucio, no blanco)
--oxido:   #8a2e1c   (sangre seca / minio mexicano)
--polvo:   #6a6557   (gris cálido para metadata)
--linea:   #1a1814   (rule sobre sala)
```

Sin acento secundario. Sin variantes. Si necesito otra señal, va con tipografía (italic, peso), no con color.

### Grano y textura

Capa fina de grano SVG sobre el `body`. Sutil, no decorativa. Hace que el negro respire.

### Spacing

- Vertical rhythm muy abierto. Páginas largas.
- Padding lateral generoso (12vw desktop, 8vw mobile).
- Max content width: 80rem.

### Movimiento

- Fade-in en imágenes al entrar al viewport (300ms ease-out).
- Sin transitions de hover en imágenes. Hover en texto: lentísimo cambio de color (450ms).
- Cursor: default, sin custom cursor (eso es Squarespace 2018).

---

## Arquitectura de información

### Rutas

```
/                  → Opening. Negro. Título. Cita corta. Un plano fijo o video silencioso loop.
/obra              → El cuerpo de trabajo. Lista codificada, no grid.
/obra/[slug]       → Una pieza, presentada como secuencia (no como ficha)
/cinta/[slug]      → Video con player limpio, sin theater decorativo
/nota              → Manifiesto en una sola página larga (con contacto al pie)
```

(El nombre `/obra` reemplaza `/archivo` — más mexicano, más artista que catálogo. Confirmá.)

### Index codificado

Antes en `/work`: un grid con 12 cards. Resultado: agencia.

Ahora en `/obra`: una **lista cripta** estilo créditos.

```
26/04   ENT — entrevista a beto                          01:38
26/03   ENT — entrevista a yolanda                       00:53
26/02   ENT — entrevista a maricela                      00:29
26/02   ENT — entrevista a lalo                          00:26
26/01   ENT — entrevista a missael (vhs)                 00:43
25/11   APX — apice                                          —
25/10   AR2 — aria en lk                                01:04
...
```

Las dos letras del código no se explican en la página. El que sabe sabe. La lista entera es la obra.

Click en cualquier fila → carga la pieza.

### Pieza individual

Layout vertical. Casi sin chrome.

1. Plate único: imagen o video, ancho disponible, negro alrededor.
2. Línea de créditos abajo:
   ```
   vd/26/04                                                          monterrey
   ```
3. Si hay texto, va abajo, una sola columna, ancho corto, italic.
4. Si hay más imágenes, scroll lento: una por viewport.

### Decisiones abiertas

- **Lo corporativo** (ARIA, Drummond, Cuvisa, etc.) — *no entra a `/obra`*. Va a `/oficio` (zona separada, accesible solo desde `/nota`, sin promoción). Es trabajo, no obra. ← *propuesta, confirmá*
- **Las fotos de eventos** (Bikefest, Bikepark, Marchas, Raúl Alcalá, Cerrando Ciclos) — mismo tratamiento. ← *propuesta, confirmá*
- **La obra "real"** entonces sería: las entrevistas familiares (5), Apice, Zara, Karen, Doña Estereso, Poasadas, Ebike Camp, Parto. ~13 piezas. Eso es el corte de autor.

---

## Tono de copy

Reescribir TODO.

Reglas:

- Frases declarativas, cortas, secas. Sin verbos de marketing.
- Bilingüe ocasional cuando aporta (latín, inglés, francés — *sparingly*).
- Fechas en formato técnico (`26/04`, no "abril 2026").
- Lugares siempre. Monterrey, Apodaca, Cerro de la Silla, etc.
- Numeración consistente. Códigos consistentes.

Prohibido permanente:

- "calidad", "carácter", "autoridad", "producto visual", "criterio"
- "vive, canta, sueña"
- micro-labels tipo "ARCHIVO VISUAL / MONTERREY / 12 EXPEDIENTES"
- emojis

Ejemplos de tono nuevo:

> **`/` home** (opening):
> > vd
> > monterrey, 2026
> > *una imagen que se cae lento al fondo de otra imagen*
> > —
> > entrar →

> **Fila de índice**:
> > 26/04   ent — beto                                                   01:38

> **Créditos al pie de una pieza**:
> > vd/26/04 · cinta · monterrey · 01:38 · h264/aac

> **`/nota` apertura**:
> > soy diego espino. trabajo en monterrey desde 2019. esto es lo que dejo afuera.

Editorial. Curatorial. Lapidario.

---

## Plan de implementación

### Fase 0 — Decisiones (BLOCKER)

Necesito tu sí/no en estas cinco:

1. **Tipografía**: ¿A (Bagnard italic + JetBrains Mono) o B (Inter Display condensed + JetBrains Mono)?
2. **Paleta**: ¿`sala/hueso/óxido` como propongo, o pintamos diferente el acento (probás cobalto, sepia)?
3. **Lo corporativo**: ¿va a `/oficio` separado, queda invisible, o lo borramos?
4. **Las fotos de eventos deportivos**: ¿mismo destino que lo corporativo, o se quedan en obra?
5. **Nombres de rutas**: ¿`/obra` `/cinta` `/nota` o querés otra cosa?

### Fase 1 — Foundation
- [ ] Quitar imports de fuentes viejas (Rubik Glitch, Unbounded, Fraunces, Space Grotesk si no se usa)
- [ ] Agregar `Bagnard` o `Inter Display` por fontsource (1 fuente nueva — confirmo supply chain)
- [ ] Reescribir `global.css`: tokens nuevos, reset, base, primitivos
- [ ] Capa de grano SVG global
- [ ] Borrar CSS decorativo viejo en bloque (`.glitch-*`, `.vid-*`, `.vhs-*`, `.theater-*` actual, `.cinta-channel-*`, `.banksy-*`, `.kinetic-loop*`)
- [ ] `BaseLayout` nuevo: header mínimo (solo "vd" arriba izquierda + botón "índice" arriba derecha), footer al pie con créditos secos

### Fase 2 — Páginas
- [ ] `/` opening: negro + título + cita + un plano (foto fija o video loop sin sonido)
- [ ] `/obra` índice codificado (lista estilo créditos)
- [ ] `/obra/[slug]` plate único + créditos
- [ ] `/cinta` y `/cinta/[slug]` ya con tratamiento "plate" (sin theater glow)
- [ ] `/nota` manifiesto + contacto al pie

### Fase 3 — Contenido
- [ ] Decidir corte de obra (qué entra, qué se mueve a `/oficio`)
- [ ] Reescribir copy de cada pieza
- [ ] Generar códigos (`vd/YY/MM` o similar) y duraciones / formatos consistentes

### Fase 4 — Detalles
- [ ] Redirects (`/work/*` → `/obra/*`, `/video/*` → `/cinta/*`, `/about` y `/contact` → `/nota`)
- [ ] Favicon nuevo (mark `vd` en negro)
- [ ] OG image: un plano fijo, sin texto
- [ ] Theme-color al `--sala`
- [ ] A11y: focus rings sobrios, contraste verificado

### Fase 5 — Ship
- [ ] Merge `redesign` → `main`
- [ ] GHA build + truenas pull
- [ ] Verificar redirects en prod

---

## Riesgos

- **Supply chain**: Bagnard o Inter Display vía fontsource = 1 dep nueva. Confirmá antes de agregar (CLAUDE.md).
- **SEO**: rutas viejas indexadas en Google. Redirects 301 necesarios.
- **Verticales 9:16**: piezas como ARIA o Cuvisa son verticales (formato Reels). Si esas son corporativas y se mueven a `/oficio`, problema resuelto. Si alguna obra real queda vertical, va a "plate alto" con borde lateral negro generoso.
- **"Difícil de entender" tiene límite**: si nadie encuentra cómo contactar, fracasamos. El manifiesto en `/nota` es el escape valve — siempre hay un email al pie.

---

## Próximo paso

Respondé las 5 preguntas de Fase 0 y arranco Fase 1.
