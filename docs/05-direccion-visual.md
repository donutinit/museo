# dirección visual

dirección: **la hoja de contacto**.

Sale del README de [`donutinit`](https://github.com/donutinit): tira de negativos,
rebate negro, grano, fuga de luz, y esa paleta de badges. No es una metáfora
decorativa — es el objeto real del oficio, y de ahí sale toda la estructura del sitio.

> pendiente de autorización de Von Diego. vive en la rama `hoja-de-contacto`.

## el objeto

Una hoja de contacto es papel fotográfico con las tiras impresas al canto. Entre
cuadro y cuadro el negativo va sin exponer, así que **imprime negro**. El código de
borde se imprime junto con la imagen porque vive en el negativo. El fotógrafo marca
con lápiz graso las que sirven.

Eso da la lógica completa:

- **el código de borde es la navegación**, y es dato real: clase de pieza + posición
- **el rollo es la sección**: proyecto de foto = un rollo; cinta = otro stock
- **la marca de lápiz graso es el hover/focus** — el único gesto audaz del sitio

## color

Seis valores, heredados del README y ajustados sólo donde el contraste lo pedía.

| token | hex | papel |
|---|---|---|
| `--rebate` | `#141317` | base del negativo entre cuadros |
| `--papel` | `#d8cfc0` | hueso: texto y lettering de borde |
| `--grasa` | `#b23a2f` | lápiz graso. **sólo el trazo**, nunca un relleno |
| `--ambar` | `#d9873f` | código de borde de rollo **foto** |
| `--verde` | `#7d8c72` | código de borde de rollo **cinta** |
| `--polvo` | `#837c70` | metadata apagada |

`--polvo` y `--verde` van levantados respecto al README (`#6d6659`, `#5c6b52`): en el
README eran fondo de badge con texto claro encima; aquí son texto chico sobre negro y
a esa altura daban 3.4:1 y 3.0:1. Levantados dan 4.7:1 y 4.6:1, sobre el mínimo AA.

El color del código de borde codifica el stock. Un sistema haciendo dos trabajos.

## tipografía

Dos familias, ambas variables, ambas de fontsource.

- **Archivo Variable** — eje `wdth` 62–125 real, así que el lettering de borde queda
  condensado de verdad, no falseado con `letter-spacing`.
  `wdth 62-68` display y código de borde · `wdth 76-82` ui y registro
- **Newsreader Variable** — la voz que se lee. 17px/1.65, medida máxima 62ch.

Salieron `@fontsource-variable/inter` y `@fontsource-variable/jetbrains-mono`: eran
las defaults que hacían que el sitio se leyera generado, y una fuente de código no es
lo que va impreso al canto de un negativo. Neto: una dependencia menos.

## layout

**Altura de tira constante, ancho de cuadro variable, aspect nativo.** Un 9:16 va
angosto, un 16:9 va ancho. El ritmo de anchos es la textura. `flex-wrap` deja la
última tira dispareja, igual que una hoja real.

Nada se recorta nunca: el ancho sale del aspect del original, verificado contra las
dimensiones reales de los archivos en R2.

Alineado a la izquierda, a bandera. Sin masonry, sin cards de igual tamaño.

## principios

1. la hoja es la interfaz. sin cards, sin radius, sin sombras. cuadro contra negro.
2. todo número en pantalla es real: año, posición, piezas, duración, cuadro.
3. nunca recortar. el aspect es información.
4. una sola cosa audaz: la marca de lápiz sobre el cuadro señalado.
5. grano estático, una capa. la fuga de luz aparece una sola vez, en la cabecera.

## lo que se retiró

Del sitio anterior, por leerse como plantilla:

- el gate «¿estás listo? clickeame» y el autoplay con sonido al scrollear
- numeración romana `i/09 … x/10` sobre contenido que no es una secuencia
- `<em>` sobre una palabra en cada titular, sin excepción
- metadata pegada con puntos medios: `A · B · C · D`
- eyebrows en versalitas trackeadas encima de cada encabezado

## los cuatro sabores que se consideraron

Historia, para no volver a discutirlos: terminal/file-system, swiss-brutalist
editorial, anti-design/dirty, y post-y2k cinematográfico. El sitio anterior tiraba al
cuarto. La hoja de contacto se quedó porque no es un estilo prestado de otra
industria: es el objeto con el que ya trabaja Von Diego.

## referencias

- el README de `donutinit` — la fuente real de la paleta y el grano
- hojas de contacto de Magnum, marcadas con lápiz graso
- lettering de borde de Kodak e Ilford
