# Home minimalista — notas de diseño

Rama `web-minimalista`. La home sigue el **manual de marca** (Jorge, «Manual de marca», oct. 2026):
menos efectos y menos texto, mucho aire, los textos de estrategia del manual y su maqueta de web
(páginas 25 y 26) como referencia de portada, navegación y tipografía.

## Qué cambió respecto a la versión anterior

- **Portada**: fuera el muro de fotogramas, el titular gigante y la pantalla de carga. Ahora es la
  de la maqueta: degradado con grano (negro, violeta y blanco), isotipo en el centro y el lema
  «Marca y web en sincronía» pequeño abajo a la izquierda. El degradado es un líquido que fluye solo
  y se deja arrastrar por el cursor.
- **Estudio**: fuera el manifiesto y el equipo. Ahora: ¿Quiénes somos? (tres columnas, como la
  maqueta), misión y visión, y los cuatro valores del manual.
- **Servicios y Contacto**: las mismas secciones, con menos texto.
- **Proyectos**: los paneles grandes de la web original (cada uno en el color de su marca, con
  navegador, móvil y el nombre en grande), pero en un **carrusel libre**: la sección ya no se queda
  fija ni obliga a ver los seis al bajar. La página baja con normalidad y el carrusel se mueve en
  horizontal solo si se quiere (trackpad o dedo, arrastrando con el ratón, flechas o Mayúsculas +
  rueda). Va sobre fondo claro, con un borde finísimo para que los paneles beis no se fundan.
- **Método**: la idea de la web original (los cuatro pasos, uno tras otro al bajar) en versión
  mínima: una lista de cuatro palabras grandes que se quedan fijas y se ilumina una cada vez, con su
  plazo y su texto al lado. Sin dibujos.
- **Planes**: como en la web original (sin cifras, «Qué incluye» desplegable, el plan completo
  destacado), en tres tarjetas con borde fino; el completo lleva borde violeta y la etiqueta.
- **Se fue**: la Fig. 01, el cursor propio, los botones magnéticos y las letras que ruedan.
- **Menú** como la maqueta: «Planes» (antes «Precios») y «Contáctanos» (antes «Hablemos»).

## Tipo, color y texto

- **Unbounded** (autoalojada, variable) en títulos, menú y botones; **Montserrat** en el texto,
  las etiquetas y los enlaces. Es lo que dice el manual (página 21). Titulares en minúscula y
  peso 600, sin mayúsculas gigantes.
- **Color**: la paleta del manual (obsidiana, violeta y glacial), editable desde el panel. Los
  colores alternativos del manual (rojo carmesí, azul digital, negro cósmico) no se usan en la web.
- **Textos del manual**: corregidos y pulidos sin cambiar el sentido (erratas como «strat up» o
  «Sentirnos motivamos», y frases largas partidas). Lo destacado en violeta es lo que el manual
  resalta. El resto de secciones, recortadas y con el tono del manual: cercano, directo, joven y
  profesional.

## La portada

Un líquido en WebGL (`js/modules/hero.js`): un shader dibuja la composición de la maqueta (negro
arriba, banda y luz violetas, ola blanca bajo el lema, lavanda abajo a la derecha) y la deforma sin
parar con cinco ondas que se arrastran unas a otras, como tinta en agua; además, las formas derivan
y la banda y la ola ondulan. Los bordes salen «pulverizados» y con grano, como en la maqueta, y la
luz es la de la maqueta (la imagen fundida en trama consigo misma). Los colores salen de la paleta
(si cambias el violeta en el panel, cambia el líquido).

- **Cursor** (solo con ratón): al moverlo, arrastra el líquido; quieto, lo abomba un poco debajo.
- **Siempre legible**: blanco garantizado bajo el lema; el blanco nunca sube hasta la barra (logo y
  menú son claros) y, si llega al isotipo, se vuelve violeta a su alrededor.
- **Sin saltos**: arranca quieto, igual que la imagen fija, aparece con un fundido y se despierta en
  un par de segundos. Cada visita empieza en un momento distinto del líquido.
- **Ligero**: un único dibujo por fotograma en la tarjeta gráfica (unos 0,1 ms de JavaScript), como
  mucho unos 70 fotogramas por segundo, resolución limitada y que baja sola si el equipo va justo;
  se pausa fuera de pantalla. El shader se compila cuando la página ya está pintada.
- **Ajustes** al principio de `hero.js`: `FLOW` (cuánto se deforma), `SPEED` (velocidad), `WAKE`
  (lo que tarda en despertar) y la fuerza y el radio del cursor.

Debajo queda la misma composición fija en SVG (manchas difuminadas + filtro de ruido + grano): es lo
que se ve al cargar y lo que se queda con movimiento reducido, sin WebGL o si la tarjeta gráfica
pierde el contexto. Las formas están en `public/index.html` (sección `.hero`) y los colores en
`home.css` (`.hero__bg`).

## Movimiento

| Qué | Dónde | Cómo se ajusta |
|---|---|---|
| Portada: el líquido | `js/modules/hero.js` (WebGL) | `FLOW`, `SPEED`, `WAKE` y el cursor, al principio del archivo; no se activa con movimiento reducido |
| Scroll suave (Lenis) | `js/modules/core.js` | `lerp`; no se activa con movimiento reducido |
| Apariciones suaves al entrar (una vez) | `js/modules/reveal.js` + `[data-reveal]` en el HTML | `style="--d:n"` escalona; duración en `.js [data-reveal]` (CSS) |
| Entrada del isotipo de la portada | CSS (`@keyframes iso-in`) | Duración en `.hero__iso` |
| Proyectos: carrusel libre con profundidad | `js/modules/work.js` + CSS (`.work`, `.wp`) | El JS solo pone `--t` en cada panel (0 en su sitio, ±1 al lado); cuánto corre cada capa, en las reglas `transform` de `.wp__browser`, `.wp__phone`, `.wp__name` y `.wp__logo`; arrastre e inercia en `DRAG_MIN`, `FLICK` y `FLING` |
| Método: lista que se ilumina | `js/modules/method.js` + CSS (`.steps`, `.step.is-on`) | Fijada solo en escritorio con ratón (`.method.is-pinned`; el alto del tramo, en `.method__pin`); en móvil se ilumina el paso que pasa por el centro |
| Planes: desplegable «qué incluye» | `js/modules/prices.js` + CSS (`.plan__panel`) | Solo cambia `aria-expanded`; la transición es CSS |
| Menú: tema claro/oscuro, velo al bajar, sección activa | `js/modules/nav.js` | Línea del 45 % en `update()` |
| Hover de Servicios (franja, isotipo, título violeta) | CSS (`.svc`) | Solo CSS |

Sin librerías de animación: WebGL, CSS, IntersectionObserver y Lenis. Con movimiento reducido no hay
scroll suave, portada animada, profundidad en Proyectos, Método fijado ni apariciones: todo está en su
sitio desde el principio y los cuatro pasos de Método, encendidos. Sin JavaScript, todo visible (y si
el JS no arranca en 3 s, también); el desplegable de Planes se ve abierto y el carrusel de Proyectos es
un scroll horizontal normal, con su barra.

## Accesibilidad

- Anclas con foco en el destino, skip link y `:focus-visible` visible en claro y oscuro.
- Jerarquía de encabezados: h1 en la portada, h2 por sección y h3/h4 dentro.
- Contraste AA garantizado por el build para cualquier paleta que se ponga en el panel; los pasos
  apagados de Método (`dim-dark`) tienen al menos 3:1, el de los textos grandes.
- Copiar el email avisa con `role="status"`; «Escríbenos» sigue siendo `mailto`.

## Rendimiento (local, Lighthouse 12)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Móvil | 99 | 100 | 100 | 100 | 2,0 s | 0 | 70 ms |
| Escritorio | 100 | 100 | 100 | 100 | 0,5 s | 0 | 0 ms |

- Sin pantalla de carga: la portada se pinta a la primera (la imagen fija) y el líquido llega después.
- Sin GSAP: solo Lenis (6 KB) y nuestros módulos.
- Fuera los fotogramas del spot y las texturas (siguen en el historial de git); solo vuelve la oscura,
  en 960 y 1600, para el panel de Syncro en Proyectos.
- Las capturas de Proyectos son `lazy`; cuando el carrusel se acerca a la pantalla se piden todas, para
  que al deslizar ya estén.
- Cloudflare comprime el texto; `_headers` da un año de caché a `/vendor` y `/fonts` y una semana a `/img`.

## Contenido editable (panel)

Textos (ES/EN) y los cinco colores se editan en el panel (ruta secreta con contraseña; ver README).
`scripts/contenido.mjs` define las secciones del panel y sus límites de caracteres; `scripts/build.mjs`
escribe los textos en `index.html` e `i18n.js` y la paleta en `:root`, y no publica nada que no pase
las comprobaciones. En los textos de Estudio y en los titulares, lo que va entre `*asteriscos*` sale
en violeta.

## Probar y desplegar

```bash
npx wrangler@latest dev      # en local, igual que producción (Worker del panel incluido)
npx wrangler@latest deploy   # publicar (con la publicación automática conectada, basta con fusionar en main)
```
