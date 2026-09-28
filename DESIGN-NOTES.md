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

1. **Apertura**: las dos mitades entran giradas y encajan; la cortina sube.
2. **Hero → Fig. 01**: las columnas del muro se mueven a distinta velocidad y se
   alinean al bajar; "Marca y web," y "en sincronía." entran por lados opuestos.
3. **Método · Definir**: 48 isotipos desordenados encajan en una retícula.
4. **Contacto**: "¿Hablamos?" y el email llegan desde lados opuestos al haz violeta.

## Estructura y ritmo

| Sección | Acto | Qué se ve | Referencia |
|---|---|---|---|
| Apertura | oscuro | Isotipo que encaja (una vez por sesión) | nbnzia |
| Hero | oscuro | Titular gigante sobre un muro curvo de trabajo real | Sasha |
| Fig. 01 | oscuro | Panel que crece a pantalla completa + frase que encaja | Grigoletti / nbnzia |
| 01 Estudio | claro | Manifiesto que se ilumina + objetos de barrio + equipo gigante | Sasha / Spyker |
| 02 Servicios | claro | Filas gigantes + vista previa que sigue al cursor | Grigoletti / nbnzia |
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
- **Texto visible de entrada**: de 745 a 388 palabras (−48 %). Ninguna pantalla pasa
  de 25 palabras de texto corrido; el resto son etiquetas, botones y el pie.
  Las descripciones de Servicios, Misión/Visión y lo que incluye cada plan van en
  desplegables (abiertos si no hay JavaScript).
- **Se cayó**: la entradilla del hero, "Ver proyectos" como segundo botón, la frase
  del negocio de la esquina y las cifras de precios (nunca las hubo).
- **Honestidad**: nada inventado. Caso 00 (marca propia), Izanagi (en desarrollo) y
  cuatro webs conceptuales, con sus etiquetas.

## Inventario de movimiento

| Qué | Dónde | Cómo se ajusta / desactiva |
|---|---|---|
| Scroll suave (Lenis) sincronizado con ScrollTrigger | `js/modules/core.js` | `lerp` en `initCore()`; no se activa con movimiento reducido |
| Apertura (≤ 1,5 s, una vez por sesión, cualquier gesto la acelera) | `hero.js` → `runOpening()` | Quitar la clase `is-opening` del script del `<head>` |
| Muro del hero: 7 columnas en bucle, velocidades `speeds[]`, se sincronizan al bajar | `hero.js` | `speeds`, `common` (px/s) y el tramo del ScrollTrigger |
| Inclinación del muro con el ratón (±5°) | `hero.js` | Multiplicadores en `onMove` |
| Fig. 01 fijada: el panel crece y la frase encaja | `fig.js` | `--fig-h` en CSS y `end` del ScrollTrigger |
| Manifiesto que se ilumina palabra a palabra | `studio.js` | `start`/`end` del scrub; colores `DIM`/`INK` |
| Objetos a tres profundidades | `studio.js` + `data-speed` en el HTML | `data-speed` de cada `.obj` |
| Nombres del equipo que se inclinan hacia el puntero | `studio.js` | Rango `/140` y ángulos |
| Filas de Servicios + vista previa que sigue al cursor | `services.js` | `quickTo` (duración) y tamaño de `.svc-preview__card` |
| Proyectos: recorrido horizontal y parallax interior | `work.js` | `fromTo` de navegador/móvil/nombre; ancho de panel en CSS |
| Método: 4 actos fijados, visual por acto | `method.js` | Tiempos de entrada/salida por acto; `visualTimeline()` |
| Titulares que entran línea a línea | `core.js` → `revealLines()` | `start`, `stagger`, `duration` |
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

## Rendimiento (local, Lighthouse 12)

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Móvil | 97 | 100 | 100 | 100 | 2,3 s | 0 | 50 ms |
| Escritorio | 100 | 100 | 100 | 100 | 0,6 s | 0,036 | 0 ms |

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
- **Un vídeo de 10–20 s sin audio** (estudio, proceso, Pontevedra) para la Fig. 01.
- **Una grabación de pantalla de Izanagi** (1440×900, 10 s) para su panel.
- Email con dominio propio cuando exista (`CONTACT_EMAIL`).

## Probar y desplegar

```bash
npx wrangler@latest dev      # en local, igual que producción (incluye _headers)
npx wrangler@latest deploy   # publicar
```
