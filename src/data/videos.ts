export type VideoKind = 'entrevista' | 'comercial' | 'corporativo' | 'personal';

export interface VideoEntry {
  slug: string;
  title: string;
  kind: VideoKind;
  year: number;
  durationLabel: string;
  src: string;
  poster: string;
  aspect: '9/16' | '16/9' | '4/3';
  transcript: string;
  tape?: string;
  caption?: string;
  vhs?: boolean;
}

export const videos: VideoEntry[] = [
  {
    slug: 'entrevista-yolanda',
    title: 'Yolanda — el zorro',
    kind: 'entrevista',
    year: 2026,
    durationLabel: '00:53',
    src: '/media/videos/entrevista-yolanda.mp4',
    poster: '/media/video-posters/entrevista-yolanda.jpg',
    aspect: '16/9',
    tape: 'EXP/01 · Yolanda',
    caption: 'Si yo vuelvo a nacer, yo le pediría a Dios que me diera el mismo padre.',
    transcript: `Híjole, el zorro, mi papá, todo un personaje, todo un personaje, ¿cómo era ser hijo?
Pues yo creo que me tocó tener el mejor padre, muy estricto, pero demasiado consentidor también.
A él le gustaba que yo cantara, le encantaba, me presumía mucho mi papá.
Híjole, a veces hasta me enojaba yo porque donde me llevaba me hacía cantar, en todas las fiestas habidas y por haber.
Entonces, ¿cómo ser? Pues yo creo que si yo vuelvo a nacer, yo le pediría a Dios que me diera el mismo padre.
Yo soy Ernesto García Guerrero, general del ejército. Ha sido algo maravilloso en mi vida.
No, no, pues sí, es una mujer que le gusta, ella es cantante profesional, es productora, es empresaria.`,
  },
  {
    slug: 'entrevista-lalo',
    title: 'Lalo — Carlos era bien juguetón',
    kind: 'entrevista',
    year: 2026,
    durationLabel: '00:26',
    src: '/media/videos/entrevista-lalo.mp4',
    poster: '/media/video-posters/entrevista-lalo.jpg',
    aspect: '16/9',
    tape: 'EXP/02 · Lalo',
    caption: 'Yo la que quería mucho era Marisela.',
    transcript: `Carlos era un niño bien juguetón, fue una linda persona, era bien compartible.
Yo la que quería mucho era Marisela, de niña, la traía como era mi consentida, mi muerca.
La traía, la abrazaba, todo, le cortaban el pelo porque era piojía, tenía piojos.`,
  },
  {
    slug: 'entrevista-maricela',
    title: 'Maricela — la yunta de güeyes',
    kind: 'entrevista',
    year: 2026,
    durationLabel: '00:29',
    src: '/media/videos/entrevista-maricela.mp4',
    poster: '/media/video-posters/entrevista-maricela.jpg',
    aspect: '16/9',
    tape: 'EXP/03 · Maricela',
    caption: 'Concha empieza a gritar y gritar porque venía la yunta de güeyes.',
    transcript: `Cuando nos íbamos, mi papá, todos los viernes llegaba el trabajo y llegaba mi mamá y nos íbamos al rancho.
Ese rancho que aún existe, que aún están mis hermanos ahí, yo también tengo y todos tenemos.
Nos íbamos al rancho y en la mañanita, luego, luego, lo peor que me pasó fue que íbamos caminando y venía una yunta de güeyes.
Y Concha empieza a gritar y gritar porque venía la yunta de güeyes.
Y entonces se asustaron los animales.`,
  },
  {
    slug: 'entrevista-missael-vhs',
    title: 'Missael — el padrino Edgar',
    kind: 'entrevista',
    year: 2026,
    durationLabel: '00:43',
    src: '/media/videos/entrevista-missael-vhs.mp4',
    poster: '/media/video-posters/entrevista-missael-vhs.jpg',
    aspect: '4/3',
    tape: 'VHS-04 · Missael',
    caption: 'Ya los invité a mi fiesta el sábado 13 de junio.',
    vhs: true,
    transcript: `Y me tumbó de la verca, de la verca.
Platícale a mi mamá.
Oye, aquí está la verca, del recho.
Y él estaba hablando de César.
Lo bueno, híjate perro.
¿El hijo?
Yo le dije, híjate perro, para que le traiga disculpas.
Si me matas el dar, le dije, salte el güey, que no lo hace mi padrino.
Y luego, ¿sabes quién va a ser mi padrino?
Edgar, sí.
Él sí me cae bien.
Por ejemplo, padrino, tráeme con una coca ahí en el papá.
Me lo trae.
Ya los invité, ya los invité a mi fiesta el sábado, el sábado 13 de junio, en mi quinta, en mi cumpleaños perro.`,
  },
  {
    slug: 'aria-lk',
    title: 'ARIA en LK',
    kind: 'corporativo',
    year: 2025,
    durationLabel: '01:04',
    src: '/media/videos/aria-lk.mp4',
    poster: '/media/video-posters/aria-lk.jpg',
    aspect: '9/16',
    tape: 'CASO 05 · ARIA',
    caption: 'Cuando en un proyecto surge una necesidad específica de climatización, ahí entramos nosotros.',
    transcript: `¿Eres empresa constructora, desarrollador industrial, arquitecto o despacho de construcción?
En ARIA, analizamos a detalle los requerimientos de climatización de tu proyecto cuando éste demanda sistemas BRF.
Y diseñamos la solución óptima conforme a las normas vigentes de la industria Achevac.
Contamos con personal altamente capacitado y certificado, así como con las herramientas y procedimientos que exigen los fabricantes.
No utilizamos atajos, trabajamos con la precisión y el rigor técnico que garantizan resultados duraderos.
Esa forma de operar nos ha permitido participar a lo largo de los años en desarrollos de gran escala
y construir un portafolio sólido de proyectos que hoy siguen funcionando de manera eficiente y confiable.
Cuando en un proyecto surge una necesidad específica de climatización, ahí entramos nosotros.
Nuestro trabajo es transformar esa necesidad en tranquilidad, asegurando sistemas que operan correctamente desde el primer día y a lo largo de toda su vida útil.
ARIA, expertos en climatización.`,
  },
  {
    slug: 'aria-wavtech',
    title: 'ARIA en Wavtech',
    kind: 'corporativo',
    year: 2025,
    durationLabel: '00:53',
    src: '/media/videos/aria-wavtech.mp4',
    poster: '/media/video-posters/aria-wavtech.jpg',
    aspect: '9/16',
    tape: 'CASO 06 · ARIA',
    caption: 'Calidad que se siente, eficiencia que se nota.',
    transcript: `En ARIA transformamos desafíos en resultados.
En este proyecto instalamos un sistema de aire lavado industrial
capaz de climatizar miles de metros cuadrados con eficiencia y precisión.
Cada unidad fue izada con grúa, montada, asegurada y calibrada,
para operar de forma independiente, garantizando el aire limpio y constante sin comprometer el rendimiento.
La magnitud de la obra exigía experiencia, coordinación y dominio técnico.
Eso es lo que entregamos.
ARIA. Calidad que se siente, eficiencia que se nota.`,
  },
  {
    slug: 'cuvisa-joselin',
    title: 'Cuvisa — DVR Pro & mini DVR',
    kind: 'corporativo',
    year: 2026,
    durationLabel: '01:57',
    src: '/media/videos/cuvisa-joselin.mp4',
    poster: '/media/video-posters/cuvisa-joselin.jpg',
    aspect: '9/16',
    tape: 'CASO 07 · Drummond',
    caption: 'Volumen de refrigerante variable, control independiente por zonas.',
    transcript: `Hoy estamos en Cubisa, donde recientemente se adquirió un sistema de climatización con tecnología DVR Pro y mini DVR de la marca Drummond Air.
En este proyecto implementamos una condensadora DVR de alto rendimiento, que nos permite conectar cassette de una vía, cassette de cuatro vías y fan and coil de media estática como unidades interiores, todo en un solo sistema.
Este corporativo necesitaba climatizar múltiples zonas de forma independiente, manteniendo eficiencia energética y control preciso de temperatura.
Por las dimensiones del espacio y la necesidad de escalabilidad, se eligió un sistema DVR Pro y mini DVR, centralizando la operación sin sacrificar flexibilidad.
Un sistema DVR Pro es un sistema de volumen de refrigerante variable, esto significa que regula automáticamente la cantidad de refrigerante que envía a cada unidad interior, según la demanda térmica de cada zona.
Aquí se ubicaron dos condensadoras DVR Pro de 14 HP y un mini DVR de 6 HP, capaces de conectar cassette de una vía de una y una y media toneladas, cassette de cuatro vías de dos y tres toneladas y fan and coil de media estática de una tonelada.
¿Y qué beneficios aporta?
Primero, eficiencia energética. Al trabajar con compresores de velocidad variable, el sistema ajusta su capacidad según la demanda real, reduciendo el consumo eléctrico.
Segundo, control independiente por zonas. Cada área puede tener su propio control de temperatura, mejorando el confort y optimizando la operación.
Tercero, centralización. Todo se integra en un solo sistema, facilitando monitoreo, mantenimiento y gestión.
Y cuarto, ahorro en infraestructura. Menos equipos exteriores significa mejor aprovechamiento del espacio, menor carga estructural y una instalación más limpia.
Si estás buscando una solución de climatización para un proyecto industrial, comercial o corporativo, la tecnología DVR Pro y mini DVR puede ser una opción ideal.
Gracias por acompañarnos en esta visita técnica. Nos vemos en el siguiente proyecto.
Cuando la calidad y el precio se fusionan, Drummond Air Conditioning.`,
  },
  {
    slug: 'drummond-infinniguard',
    title: 'Drummond × InfinniGuard',
    kind: 'comercial',
    year: 2025,
    durationLabel: '01:08',
    src: '/media/videos/drummond-infinniguard.mp4',
    poster: '/media/video-posters/drummond-infinniguard.jpg',
    aspect: '9/16',
    tape: 'CASO 08 · Drummond',
    caption: 'Aplicación de InfinniGuard sobre una condensadora Drummond Air.',
    transcript: `En este video se puede ver cómo le aplican InfinniGuard a una condensadora Drummond Air.`,
  },
  {
    slug: 'presentacion-nave',
    title: 'Presentación de nave industrial',
    kind: 'corporativo',
    year: 2026,
    durationLabel: '01:02',
    src: '/media/videos/presentacion-nave.mp4',
    poster: '/media/video-posters/presentacion-nave.jpg',
    aspect: '9/16',
    tape: 'CASO 09 · Autódromo IP',
    caption: '31,168 m² de nave, 18 andenes, corredor Monterrey–Laredo.',
    transcript: `Te presentamos una nave diseñada para operación industrial y logística de alto nivel en Autódromo Industrial Park sobre el corredor Monterrey-Laredo.
Tiene 31.168 m² de nave y 60.972 m² de superficie total.
Ubicada a solo 200 km de Laredo, se integra de forma eficiente a las rutas de importación y exportación, optimizando tiempos de tránsito y costos logísticos.
La nave dispone con 18 andenes de carga y descarga, pensados para operar con volúmenes altos y movimientos continuos.
La infraestructura cuenta con retornos estratégicos que agilizan la circulación de trailers y mejoran el flujo interno de carga y descarga.
Además, el corredor se beneficia de una amplia oferta de fuerza laboral proveniente de Ciénaga de Flores, Apodaca y Escobedo, ideal para proyectos que requieren crecimiento sostenido de personal.
Además, cuenta con 236 espacios de estacionamiento.`,
  },
  {
    slug: 'recepcion-250-toneladas',
    title: 'Recepción · 250 toneladas',
    kind: 'corporativo',
    year: 2026,
    durationLabel: '01:14',
    src: '/media/videos/recepcion-250-toneladas.mp4',
    poster: '/media/video-posters/recepcion-250-toneladas.jpg',
    aspect: '9/16',
    tape: 'CASO 10 · operación',
    caption: 'Coordinación de recepción industrial de gran tonelaje.',
    transcript: '',
  },
  {
    slug: 'parto',
    title: 'Parto',
    kind: 'personal',
    year: 2026,
    durationLabel: '00:40',
    src: '/media/videos/parto.mp4',
    poster: '/media/video-posters/parto.jpg',
    aspect: '4/3',
    tape: 'PIEZA · obra personal',
    caption: 'Un instante. Un nacimiento.',
    transcript: '',
  },
];

export const youtubeFeature = {
  id: 'gQPOegxVKmo',
  title: 'Canal · pieza destacada',
  url: 'https://youtu.be/gQPOegxVKmo',
  caption:
    'Transmisión desde el archivo de Von Diego. Recortada con cinta, cinco capas y un tag a mano.',
};

export const kindLabel: Record<VideoKind, string> = {
  entrevista: 'Entrevista',
  comercial: 'Comercial',
  corporativo: 'Corporativo',
  personal: 'Obra personal',
};

export const interviews = videos.filter((v) => v.kind === 'entrevista');
export const nonInterviews = videos.filter((v) => v.kind !== 'entrevista');
