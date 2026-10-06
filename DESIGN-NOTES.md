# Home minimalista — notas de diseño

Rama `web-minimalista`. La home sigue el **manual de marca** (Jorge, «Manual de marca», oct. 2026):
menos efectos y menos texto, mucho aire, los textos de estrategia del manual y su maqueta de web
(páginas 25 y 26) como referencia de portada, navegación y tipografía.

## Qué cambió respecto a la versión anterior

- **Portada**: fuera el muro de fotogramas, el titular gigante y la pantalla de carga. Ahora es la
  de la maqueta: degradado con grano (negro, violeta y blanco), isotipo en el centro y el lema
  «Marca y web en sincronía» pequeño abajo a la izquierda.
- **Estudio**: fuera el manifiesto y el equipo. Ahora: ¿Quiénes somos? (tres columnas, como la
  maqueta), misión y visión, y los cuatro valores del manual.
- **Servicios, Proyectos, Planes, Contacto**: las mismas secciones, con menos texto y sin secciones
  fijadas. Proyectos pasa de recorrido horizontal a rejilla; Planes muestra lo que incluye cada plan
  en un desplegable, como en la web original.
- **Método**: igual que en la web original (cuatro actos fijados en escritorio, uno debajo de otro en
  móvil), solo con la tipografía y los textos del manual.
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

El degradado es un SVG con formas difuminadas (una ola blanca, una banda violeta y manchas violeta
y lavanda) al que un filtro desplaza los píxeles con ruido: así los bordes quedan «pulverizados»
como en la maqueta, y encima va un grano fino que no se mueve. Sus colores salen de la paleta (si
cambias el violeta en el panel, cambia el degradado): `hero-violet`, `hero-night`, `hero-deep` y
`hero-lavender` (`scripts/contenido.mjs › DERIVADOS`) son esos mismos tonos aclarados, para que el
degradado brille igual que en la maqueta sin tocar los colores que se usan en el resto de la web.

Cada mancha es ahora una capa suelta (`.hero__layer[data-drift]`) un 24 % más grande que la portada,
y deriva sola: un recorrido aleatorio y suave (sumas de senos con fases al azar) mueve, gira y
escala cada capa en un bucle largo de 20 a 34 s, sin repetirse de forma evidente. El movimiento vive
en `js/modules/hero.js`, corre con Web Animations sobre `transform` (compositor, sin repintar) y se
pausa si la portada sale de pantalla. Las amplitudes de cada capa (`DRIFT`) están calculadas para
que, en el peor caso y en cualquier ancho de pantalla, la capa nunca deje asomar su borde; si se
tocan, hay que volver a comprobarlo. Con movimiento reducido, la animación no arranca y queda la
imagen fija (el primer fotograma coincide con ella).
Las formas están en `public/index.html` (sección `.hero`) y los colores en `home.css` (`.hero__bg`).

## Movimiento

| Qué | Dónde | Cómo se ajusta |
|---|---|---|
| Degradado de la portada (deriva sola) | `js/modules/hero.js` | Amplitudes y duración en `DRIFT`; no se activa con movimiento reducido |
| Scroll suave (Lenis) | `js/modules/core.js` | `lerp`; no se activa con movimiento reducido |
| Apariciones suaves al entrar (una vez) | `js/modules/reveal.js` + `[data-reveal]` en el HTML | `style="--d:n"` escalona; duración en `.js [data-reveal]` (CSS) |
| Entrada del isotipo de la portada | CSS (`@keyframes iso-in`) | Duración en `.hero__iso` |
| Método: los cuatro actos (GSAP + ScrollTrigger, como en la web original) | `js/modules/method.js` | Fijados y atados al scroll solo en escritorio con ratón; en móvil, cada acto se reproduce al entrar |
| Planes: desplegable «qué incluye» | `js/modules/prices.js` + CSS (`.plan__panel`) | Solo cambia `aria-expanded`; la transición es CSS |
| Menú: tema claro/oscuro, velo al bajar, sección activa | `js/modules/nav.js` | Línea del 45 % en `update()` |
| Hover de Servicios (franja, isotipo, título violeta) | CSS (`.svc`) | Solo CSS |

GSAP + ScrollTrigger volvieron solo para Método (los cuatro actos fijados, como en la web original);
el resto sigue en CSS, IntersectionObserver, Web Animations y Lenis. Con movimiento reducido no hay
scroll suave, portada animada, actos de Método ni apariciones: todo está en su sitio desde el principio.
Sin JavaScript, todo visible (y si el JS no arranca en 3 s, también); el desplegable de Planes se ve abierto.

## Accesibilidad

- Anclas con foco en el destino, skip link y `:focus-visible` visible en claro y oscuro.
- Jerarquía de encabezados: h1 en la portada, h2 por sección y h3/h4 dentro.
- Contraste AA garantizado por el build para cualquier paleta que se ponga en el panel.
- Copiar el email avisa con `role="status"`; «Escríbenos» sigue siendo `mailto`.

## Rendimiento (local, Lighthouse 12)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Móvil | 99 | 100 | 100 | 100 | 2,2 s | 0 | 0 ms |
| Escritorio | 100 | 100 | 100 | 100 | 0,5 s | 0 | 0 ms |

- Sin pantalla de carga: la portada se pinta a la primera. GSAP solo lo carga Método (28 + 18 KB).
- Fuera los fotogramas del spot y las texturas oscuras (siguen en el historial de git).
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
