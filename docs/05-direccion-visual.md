# dirección visual

dirección elegida: **brutalismo / experimental**. el donut quiere algo que destaque, no un portafolio cookie-cutter de "[nombre] | photographer".

## sabores brutalistas considerados

estas son las cuatro direcciones discutidas. **pendiente la decisión final** — bloquea el resto del trabajo de código (tipografía, layout, paleta).

### 1. terminal / file-system

estética de directorio unix. el portafolio se siente como hackear un servidor.

```
INDEX OF /portfolio/

DRWX  2026-03-15  001_boda_martinez/     [4 reels, 47 fotos]
DRWX  2026-02-08  002_ed_nike_ss26/      [1 reel, 12 fotos]
DRWX  2026-01-22  003_retrato_luna/      [23 fotos]

> _
```

- tipografía: mono pesada (jetbrains mono, fira code, ibm plex mono)
- paleta: negro + verde fósforo o ámbar (terminal vibes)
- interacción: cursor blink, comandos tipeados, "ls", "cat", "open"
- ideal para: alguien que quiere comunicar control técnico + estética nicho

### 2. swiss-brutalist editorial

grids estrictos, tipografía sans pesada, color limitado pero refinado. estilo kanye website / balenciaga / yeezy.

```
███ portfolio —— 2026 ███

01 / work →
02 / film
03 / photo
04 / about

[reel autoplay full-bleed con type encima]
```

- tipografía: helvetica display, inter display, neue haas grotesk
- paleta: negro/blanco/un acento (rojo, naranja)
- interacción: hover transitions duras, sin animaciones suaves
- ideal para: target editorial / fashion / branding

### 3. anti-design / dirty

tipografía mezclada, elementos rotados, overlays semi-rotos, glitch ocasional. zine punk / cargo collective 2010s.

```
  /portafolio/
   ~videografía~
        + foto +
      [scroll]↓↓↓
   ¿que pedo?
      *click to enter*
```

- tipografía: mix de serif + mono + display rotos
- paleta: alta saturación, choques cromáticos
- interacción: micro-interacciones impredecibles, easter eggs
- ideal para: target cultura / arte / videoclip musical

### 4. post-y2k cinematográfico

brutalismo + estética cine: aspect ratios marcados, letterboxing, type tipo créditos de película.

```
             a film by

          [tu nombre]
              ───

        "reel  2026"

      [▶ play]  [■ work]
```

- tipografía: times / didone / display tipo créditos
- paleta: cinematográfica, negros profundos, highlights cálidos
- interacción: transitions tipo wipe/fade de cine
- ideal para: posicionarse como director / dp más que como fotógrafo

## decisión pendiente

esperando que el donut confirme cuál de los cuatro. cualquiera funciona pero implican:

- distinto sistema tipográfico
- distinto tono de interacción
- distinto target implícito

ver [06-roadmap.md](./06-roadmap.md) — esto es el siguiente bloqueo antes de empezar a codear.

## referencias visuales recomendadas

(para construir moodboard, sin importar el sabor elegido)

- **balenciaga.com** — swiss-brutalist
- **bloomberg terminal screenshots** — terminal
- **yeezy.com archivos en wayback machine** — swiss-brutalist + post-y2k
- **cargo.site** — anti-design, cargo era
- **a24films.com** — post-y2k cinematográfico
- **are.na** — buscar "brutalist web", "terminal aesthetic", "y2k portfolio"
- **siteinspire.com** — categoría minimal/experimental

## consideraciones específicas para video/foto

independiente del sabor, hay decisiones de presentación que aplican a cualquier dirección:

- **dark mode por defecto**: el color en video/foto se aprecia mejor sobre fondo oscuro
- **aspect ratios honestos**: no recortar reels a un cuadrado solo por layout — usar el aspect original o letterbox limpio
- **transitions entre proyectos**: view transitions api permite seguir un thumbnail al detalle del proyecto sin "salto" — muy cinematográfico
- **carga progresiva**: blurhash o thumbhash en lugar de un loader genérico — más editorial
- **modo "contact sheet"** opcional: vista densa de todas las fotos de una sesión, estilo hoja de contactos de fotógrafo análogo
