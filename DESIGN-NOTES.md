# Rediseño de la home — notas

Rama `redesign-home`. La home pasa de contar las cosas con texto a enseñarlas con
imagen y movimiento: menos palabras, trabajo real a gran tamaño, ritmo de "actos"
claros y oscuros. El contenido es el mismo; la forma de contarlo, no.

Referencias (por orden): sashamartynchuk.com (ritmo y movimiento), grigoletti.ch
(orden e índices), spykercars.com (la imagen manda), nbnzia.com (un concepto que
lo ata todo). Se ha tomado el tono, no los diseños.

## Concepto: «En sincronía»

El isotipo es un trazo en S que se cortó por la línea que une sus dos puntas
(mismo trazo del manual, recortado con `clipPath`; no se ha redibujado nada).
Esas dos mitades desfasadas que encajan son el motivo de movimiento, en 4 momentos:

1. **Apertura**: un campo de caracteres ondula en dos fases que se van alineando
   mientras el contador llega a 100 (como la carga de la web modelo Marea); la cortina sube.
2. **Hero → Fig. 01**: las columnas del muro se mueven a distinta velocidad y se
   alinean al bajar; en la Fig. 01 las dos mitades del isotipo entran giradas desde
   lados opuestos y encajan, y sube "Marca y web, en sincronía."
3. **Método · Definir**: 48 isotipos desordenados encajan en una retícula.
4. **Contacto**: "¿Hablamos?" y el email llegan desde lados opuestos al haz violeta.

## Estructura y ritmo

| Sección | Acto | Qué se ve | Referencia |
|---|---|---|---|
| Apertura | oscuro | Caracteres que ondulan y se sincronizan + contador 000→100 (una vez por sesión) | Marea (web modelo) |
| Hero | oscuro | Titular gigante sobre un muro curvo con fotogramas del spot (provisional) | Sasha |
| Fig. 01 | oscuro | Las dos mitades del isotipo encajan + frase | nbnzia |
| 01 Estudio | claro | Manifiesto que se ilumina + misión y visión en grande + equipo compacto | Sasha |
| 02 Servicios | claro | Índice sencillo: número, título y descripción a la vista (sin imágenes) | Grigoletti |
| 03 Proyectos | oscuro | Recorrido horizontal fijado, seis paneles de marca | Sasha / nbnzia |
| 04 Método | oscuro | Cuatro actos a pantalla completa + lema | Sasha / Spyker |
| 05 Precios | claro | La pantalla tranquila: sin cifras, lo mínimo | — |
| 06 Contacto | oscuro | Resplandor violeta, haz vertical, pie | Sasha |

El orden de secciones es el de siempre (lo pediste así). Las anclas no cambian.

## Tipo, color y texto

- **Montserrat en todo** (variable 100–900, autoalojada). Titulares en mayúsculas,
  peso 800, interletra −0,035/−0,05 em. Unbounded solo vive en el logo SVG.
- **Color**: obsidiana, violeta y glacial del manual. El violeta es la luz (acento,
  haz, cursor, estado activo), no el fondo. Sobre oscuro, el texto violeta usa
  `--violet-soft` #A08BFF (6,2:1); el violeta puro solo da 2,1:1.
- **Paleta editable**: cinco colores se cambian desde el panel (obsidiana, violeta,
  violeta sobre oscuro, glacial y gris de texto). El resto de tonos (superficies, grises
  sobre oscuro, textos "apagados", maquetas) se calculan a partir de ellos en el build
  (`scripts/contenido.mjs › DERIVADOS`); las transparencias usan `color-mix()` sobre esas
  variables. No queda ningún color de marca escrito a mano en el CSS ni en el JS (solo sombras
  negras). Los colores de las marcas de ejemplo (paneles de Proyectos) y de las imágenes no cambian.
  El build no publica una paleta sin contraste AA, y los textos "apagados" se ajustan solos
  lo justo para seguir legibles.
- **Texto**: frases cortas y mucha imagen. Misión, visión y la descripción de cada
  servicio están a la vista (Misión y Visión van antes que el equipo); lo que incluye
  cada plan va en un desplegable (abierto si no hay JavaScript).
- **Se cayó**: la entradilla del hero, "Ver proyectos" como segundo botón, la frase
  del negocio de la esquina y las cifras de precios (nunca las hubo).
- **Honestidad**: nada inventado. Caso 00 (marca propia), Izanagi (en desarrollo) y
  cuatro webs conceptuales, con sus etiquetas.

## Inventario de movimiento

| Qué | Dónde | Cómo se ajusta / desactiva |
|---|---|---|
| Scroll suave (Lenis) sincronizado con ScrollTrigger | `js/modules/core.js` | `lerp` en `initCore()`; no se activa con movimiento reducido |
| Apertura (~3 s, una vez por sesión, cualquier gesto la acelera ×4) | `hero.js` → `runOpening()` | Duración del contador en el timeline; quitar la clase `is-opening` del script del `<head>` la desactiva |
| Muro del hero: 7 columnas en bucle con los fotogramas del spot (`img/spot/`), se sincronizan al bajar | `hero.js` | `speeds`, `common` (px/s) y el tramo del ScrollTrigger |
| Inclinación del muro con el ratón (±5°) | `hero.js` | Multiplicadores en `onMove` |
| Fig. 01 fijada: las mitades del isotipo encajan, resplandor y frase | `fig.js` | `--fig-h` en CSS y `end` del ScrollTrigger; en móvil se reproduce una vez |
| Manifiesto que se ilumina palabra a palabra (todas empiezan apagadas) | `studio.js` | `start`/`end` del scrub; colores `--dim-light`/`--dim-hl` → `--ink`/`--violet` |
| Misión y visión línea a línea; fichas del equipo que suben | `studio.js` | `start` y `delay` de `revealLines()`; `stagger` de las fichas |
| Servicios: las filas entran; hover con franja, isotipo en el margen y título violeta | `services.js` + CSS (`.svc`) | Solo CSS para el hover |
| Proyectos: recorrido horizontal y parallax interior | `work.js` | `fromTo` de navegador/móvil/nombre; ancho de panel en CSS |
| Método: 4 actos fijados, visual por acto | `method.js` | Tiempos de entrada/salida por acto; `visualTimeline()` |
| Titulares que entran línea a línea | `core.js` → `revealLines()` | `start`, `stagger`, `duration` |
| Máscaras de línea (`.ln`) con holgura arriba para las tildes de las mayúsculas | `home.css` | Si una frase con Í/É/Á entra desde su máscara, escóndela ≥ 130 % (no 105 %) |
| Contacto: las dos mitades encajan en el haz | `contact.js` | `xPercent` inicial y tramo |
| Cursor (enlace, "Arrastra", "Ver web ↗") y botones magnéticos | `cursor.js` | `data-cursor`, `data-magnetic` |
| Navegación: píldora con sección activa, tema por acto, letras que ruedan | `nav.js` | Línea del 45 % en `update()` |

Curvas: `expo.out` para entradas, `power3/4` para salidas, `none` en lo atado al
scroll. Solo se animan `transform`, `opacity`, `clip-path` y `color`.

## Movimiento reducido, táctil y sin JavaScript

- **Movimiento reducido**: sin Lenis, sin apertura, sin fijados, sin parallax, sin
  cursor. Todo en su estado final; Proyectos es un carrusel nativo.
- **Táctil o ventana < 1024 px**: nada se fija. Proyectos es un carrusel con
  ajuste a cada panel; los actos de Método van uno debajo de otro y se reproducen
  al entrar.
- **Sin JavaScript**: todo visible; la barra lleva fondo propio; desplegables abiertos.
- **Red de seguridad**: si el JS no arranca en 4 s, se quitan los estados de animación.
  Cada sección arranca por separado: si una falla, las demás siguen.

## Accesibilidad

- Anclas con foco en el destino, skip link, `:focus-visible` visible en claro y oscuro.
- Teclado: todo es alcanzable; en Proyectos, al enfocar un panel el scroll lo centra
  y las flechas ← → pasan de panel.
- Idioma a mitad de página: los cortes de SplitText se rehacen y los fijados siguen.
- Contraste AA (scrims sobre el muro; texto "apagado" del manifiesto ≥ 3:1 en texto grande).
- Copiar el email avisa con `role="status"`; `Escríbenos` sigue siendo `mailto`.

## Rendimiento (local, Lighthouse 12, primera visita con la apertura)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Móvil | 99 | 100 | 100 | 100 | 2,2 s | 0 | 30 ms |
| Escritorio | 100 | 100 | 100 | 100 | 0,5 s | 0 | 0 ms |

- `index.html`: de 426 KB a ~58 KB (sin base64; gzip ≈ 10 KB).
- Carga inicial en móvil: ~262 KB transferidos. Imágenes en AVIF + WebP con `srcset`
  (240/480 en el muro, 640/1120 en capturas); todo lo que no se ve, en diferido.
- La textura oscura pasó de 245 KB incrustada a 9–52 KB según ancho (el grano se
  hace con un ruido SVG en CSS).
- Cloudflare comprime el texto en producción; `_headers` da un año de caché a
  `/vendor` y `/fonts` (carpetas con versión) y una semana a `/img`.

## Material que mejoraría la web (opcional)

No hay huecos ni imágenes de relleno: todo es material real del repo o se
dibuja en código. Si me lo das, sube de nivel:

- **Fotos del equipo** (Jorge, Lois, Elías), mismo tratamiento las tres.
- **Los fotogramas definitivos del muro** (ahora son del spot, de forma provisional).
  El vídeo del spot (21,7 MB) no se usa: habría que recortarlo y comprimirlo antes.
- **Una grabación de pantalla de Izanagi** (1440×900, 10 s) para su panel.
- Email con dominio propio cuando exista (`CONTACT_EMAIL`).

## Contenido editable (panel)

Textos (ES/EN) y los cinco colores se editan en un panel (Sveltia CMS) en una ruta secreta con
contraseña; cómo entrar y cómo funciona está en el README. Lo importante para el diseño:

- **Una sola fuente**: `content/`. `scripts/build.mjs` escribe los textos en `index.html`
  (el español va en el HTML para Google y sin JavaScript) y en `i18n.js`, y la paleta en `:root`.
- **Texto plano**: sin HTML en el panel. Lo que va entre `*asteriscos*` sale en violeta
  (`<em>` en titulares, `.hl` en el manifiesto). Las tres líneas del titular del hero son
  tres campos; el isotipo de la segunda lo pone el build.
- **Límites de caracteres** por campo (`scripts/contenido.mjs`), pensados para que ningún texto
  rompa su maqueta: p. ej. 13 caracteres en la línea 2 del hero o 12 en las palabras gigantes
  del Método.
- La web publicada sigue siendo estática: el Worker solo actúa en el panel y en las rutas que no existen.

## Probar y desplegar

```bash
npx wrangler@latest dev      # en local, igual que producción (incluye _headers)
npx wrangler@latest deploy   # publicar
```
