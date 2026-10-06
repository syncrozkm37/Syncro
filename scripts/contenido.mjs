/* =========================================================
   Qué se puede editar desde el panel: textos (ES/EN) y colores.
   Es la única fuente: de aquí salen la configuración del panel
   (public/_panel/config.yml) y las comprobaciones del build.

   Añadir un texto nuevo:
   1. Añádelo aquí, en su sección (clave, nombre en el panel, límite).
   2. Pon data-i18n="clave" (o data-i18n-html / data-i18n-attr) en el HTML.
   3. Escribe su valor en content/textos/<sección>.json, en "es" y "en".
   4. node scripts/build.mjs
   ========================================================= */

export const LOCALES = ["es", "en"];

/* Nombre del campo en los JSON y en el panel (sin puntos): "svc.1t" → "svc_1t" */
export const campo = (key) => key.replace(/\./g, "_");

/* Campo de texto.
   max: límite de caracteres (en los dos idiomas).
   largo: caja de varias líneas en el panel.
   violeta: lo que vaya entre *asteriscos* sale destacado ("em" en titulares, "hl" en textos). */
const t = (key, label, max, extra = {}) => ({ key, label, max, ...extra });
// Las pistas del panel se leen como Markdown: \\* para que se vean los asteriscos
const VIOLETA = "Lo que pongas entre \\*asteriscos\\* sale en violeta (p. ej. Que te \\*elijan.\\*).";

export const SECCIONES = [
  {
    file: "portada", label: "Portada",
    fields: [
      t("hero.title", "Lema", 40, { hint: "Abajo a la izquierda, sobre el degradado." }),
      t("hero.sub", "Frase bajo el lema", 90, { largo: true }),
    ],
  },
  {
    file: "estudio", label: "01 · Estudio",
    fields: [
      t("studio.label", "Etiqueta de sección", 20),
      t("about.title", "¿Quiénes somos? · título", 40),
      t("about.1", "¿Quiénes somos? · columna 1", 200, { largo: true, violeta: "hl", hint: VIOLETA }),
      t("about.2", "¿Quiénes somos? · columna 2", 200, { largo: true, violeta: "hl", hint: VIOLETA }),
      t("about.3", "¿Quiénes somos? · columna 3", 200, { largo: true, violeta: "hl", hint: VIOLETA }),
      t("mission.label", "Misión · título", 20),
      t("mission.q", "Misión · pregunta", 70),
      t("mission.text", "Misión · texto", 420, { largo: true, violeta: "hl", hint: VIOLETA }),
      t("vision.label", "Visión · título", 20),
      t("vision.q", "Visión · pregunta", 70),
      t("vision.text", "Visión · texto", 360, { largo: true, violeta: "hl", hint: VIOLETA }),
      t("values.title", "Valores · título", 30),
      t("val.1t", "Valor 1 · nombre", 20), t("val.1d", "Valor 1 · frase", 110, { largo: true }),
      t("val.2t", "Valor 2 · nombre", 20), t("val.2d", "Valor 2 · frase", 110, { largo: true }),
      t("val.3t", "Valor 3 · nombre", 20), t("val.3d", "Valor 3 · frase", 110, { largo: true }),
      t("val.4t", "Valor 4 · nombre", 20), t("val.4d", "Valor 4 · frase", 110, { largo: true }),
    ],
  },
  {
    file: "servicios", label: "02 · Servicios",
    fields: [
      t("svc.label", "Etiqueta de sección", 20),
      t("svc.title", "Titular", 40, { violeta: "em", hint: VIOLETA }),
      t("svc.1t", "Servicio 1 · título", 26, { hint: "También es el nombre del plan 1 en Planes." }), t("svc.1d", "Servicio 1 · descripción", 110, { largo: true }),
      t("svc.2t", "Servicio 2 · título", 26, { hint: "También es el nombre del plan 2 en Planes." }), t("svc.2d", "Servicio 2 · descripción", 110, { largo: true }),
      t("svc.3t", "Servicio 3 · título", 26), t("svc.3d", "Servicio 3 · descripción", 110, { largo: true }),
      t("svc.4t", "Servicio 4 · título", 26), t("svc.4d", "Servicio 4 · descripción", 110, { largo: true }),
      t("svc.5t", "Servicio 5 · título (próximamente)", 26), t("svc.5d", "Servicio 5 · descripción", 110, { largo: true }),
    ],
  },
  {
    file: "proyectos", label: "03 · Proyectos",
    fields: [
      t("work.label", "Etiqueta de sección", 20),
      t("work.title", "Titular", 60, { violeta: "em", hint: VIOLETA }),
      t("work.intro", "Entradilla", 100, { largo: true }),
      t("work.p0s", "Syncro · subtítulo", 40),
      t("work.izS", "Izanagi · subtítulo", 60),
      t("work.p1s", "Olmo · sector", 32),
      t("work.p2s", "Kaia · sector", 32),
      t("work.p3s", "Ferro · sector", 32),
      t("work.p4s", "Marea · sector", 32),
      t("work.own", "Etiqueta «caso propio»", 16),
      t("work.dev", "Etiqueta «en desarrollo»", 20),
      t("work.concept", "Etiqueta «conceptual»", 16),
      t("work.view", "Enlace «ver web»", 16),
      t("work.newTab", "Aviso de pestaña nueva", 36, { hint: "Solo lo oyen los lectores de pantalla." }),
    ],
  },
  {
    file: "metodo", label: "04 · Método",
    fields: [
      t("proc.label", "Etiqueta de sección", 20),
      t("proc.title", "Titular", 70, { violeta: "em", hint: VIOLETA }),
      t("proc.1t", "Paso 1 · palabra", 14), t("proc.1d", "Paso 1 · texto", 90, { largo: true }), t("proc.1w", "Paso 1 · plazo", 16),
      t("proc.2t", "Paso 2 · palabra", 14), t("proc.2d", "Paso 2 · texto", 90, { largo: true }), t("proc.2w", "Paso 2 · plazo", 16),
      t("proc.3t", "Paso 3 · palabra", 14), t("proc.3d", "Paso 3 · texto", 90, { largo: true }), t("proc.3w", "Paso 3 · plazo", 16),
      t("proc.4t", "Paso 4 · palabra", 14), t("proc.4d", "Paso 4 · texto", 90, { largo: true }), t("proc.4w", "Paso 4 · plazo", 16),
      t("proc.q", "Lema", 60, { violeta: "em", hint: VIOLETA }),
      t("proc.qp", "Lema · frase", 80),
    ],
  },
  {
    file: "precios", label: "05 · Planes",
    fields: [
      t("price.label", "Etiqueta de sección", 20),
      t("price.title", "Titular", 60, { violeta: "em", hint: VIOLETA }),
      t("price.amt", "Precio · texto", 16, { hint: "Encima de los planes: «A medida · Presupuesto cerrado en 48 h»." }),
      t("price.quote", "Precio · frase", 40),
      t("price.monthly", "Cuota mensual", 24, { hint: "Sale en los planes 2 y 3." }),
      t("price.includes", "Desplegable «qué incluye»", 24, { hint: "Sale en los tres planes: abre la lista de lo que incluye cada uno." }),
      t("price.cta", "Botón", 28, { hint: "Sale en los tres planes." }),
      t("price.aL", "Plan 1 · etiqueta", 16), t("price.aF", "Plan 1 · para quién", 50),
      t("price.a1", "Plan 1 · incluye 1", 50), t("price.a2", "Plan 1 · incluye 2", 50), t("price.a3", "Plan 1 · incluye 3", 50), t("price.a4", "Plan 1 · incluye 4", 50),
      t("price.bF", "Plan 2 · para quién", 50),
      t("price.b1", "Plan 2 · incluye 1", 50), t("price.b2", "Plan 2 · incluye 2", 50), t("price.b3", "Plan 2 · incluye 3", 50), t("price.b4", "Plan 2 · incluye 4", 50),
      t("price.badge", "Plan 3 · distintivo", 20), t("price.cL", "Plan 3 · etiqueta", 16), t("price.cN", "Plan 3 · nombre", 28), t("price.cF", "Plan 3 · para quién", 50),
      t("price.c1", "Plan 3 · incluye 1", 50), t("price.c2", "Plan 3 · incluye 2", 50), t("price.c3", "Plan 3 · incluye 3", 50), t("price.c4", "Plan 3 · incluye 4", 50),
      t("price.note", "Nota final", 100, { largo: true }),
    ],
  },
  {
    file: "contacto", label: "06 · Contacto y pie",
    fields: [
      t("contact.label", "Etiqueta de sección", 20),
      t("contact.big", "Titular", 20),
      t("contact.p", "Texto", 120, { largo: true }),
      t("contact.cta", "Botón", 20),
      t("contact.copy", "Pista bajo el email", 45),
      t("contact.copied", "Aviso al copiar el email", 24),
      t("foot.p", "Pie · frase", 80),
      t("foot.nav", "Pie · título navegación", 20),
      t("foot.studio", "Pie · título estudio", 20),
      t("foot.lang", "Pie · título idioma", 20),
      t("foot.made", "Pie · hecho en", 30),
      t("foot.top", "Pie · volver arriba", 24),
    ],
  },
  {
    file: "general", label: "Menú, Google y accesibilidad",
    fields: [
      t("meta.title", "Título en Google y en la pestaña", 65),
      t("meta.desc", "Descripción en Google", 170, { largo: true, hint: "Lo que sale bajo el título en los resultados de búsqueda." }),
      t("nav.studio", "Menú · Estudio", 14, { hint: "Menú de arriba, menú del móvil y pie." }),
      t("nav.services", "Menú · Servicios", 14, { hint: "Menú de arriba, menú del móvil y pie." }),
      t("nav.work", "Menú · Proyectos", 14, { hint: "Menú de arriba, menú del móvil y pie." }),
      t("nav.process", "Menú · Método", 14, { hint: "Menú de arriba, menú del móvil y pie." }),
      t("nav.pricing", "Menú · Planes", 14, { hint: "Menú de arriba, menú del móvil y pie." }),
      t("nav.contact", "Menú · Contacto", 14, { hint: "Menú del móvil." }),
      t("nav.cta", "Menú · botón", 18),
      t("nav.menu", "Botón de menú (móvil)", 30, { hint: "Solo lo oyen los lectores de pantalla." }),
      t("a11y.skip", "Enlace «saltar al contenido»", 40, { hint: "Aparece al navegar con el teclado." }),
    ],
  },
];

/* Claves compuestas: varios campos del panel forman un solo texto de la web (ahora no hay ninguna) */
export const COMPUESTAS = {};

/* ---------- Colores ----------
   Cinco colores editables; el resto de tonos se calculan a partir de ellos
   (mezclas en sRGB, igual que color-mix(in srgb, …) en CSS). */
export const COLORES = [
  { name: "obsidiana", token: "obsidian", label: "Negro obsidiana", hint: "Fondos oscuros y texto principal. Tiene que ser muy oscuro." },
  { name: "violeta", token: "violet", label: "Violeta eléctrico", hint: "Acento sobre fondos claros (botones, números, palabras destacadas) y el degradado de la portada. Tiene que contrastar con el blanco glacial." },
  { name: "violeta_suave", token: "violet-soft", label: "Violeta sobre oscuro", hint: "El violeta de los textos sobre fondo oscuro. Tiene que ser claro." },
  { name: "glacial", token: "glacial", label: "Blanco glacial", hint: "Fondos claros y texto sobre oscuro. Tiene que ser muy claro." },
  { name: "gris", token: "ink-muted", label: "Gris de texto", hint: "Textos secundarios y base de los grises." },
];

/* Tonos derivados: [color A, color B, cuánto de B, ajuste]  (B puede ser "#000000" o "#FFFFFF").
   ajuste (opcional): { fondo, min, hacia } — si el tono no llega a "min" de contraste sobre "fondo",
   la mezcla se mueve hacia "hacia" (0 = todo A, 1 = todo B) lo justo para llegar.
   Así los textos "apagados" siguen legibles aunque cambien los colores base. */
export const DERIVADOS = {
  "ink": ["obsidian", "obsidian", 0],
  "glacial-2": ["glacial", "ink-muted", 0.06],        // superficies claras (franja de Servicios, tarjetas)
  "obsidian-2": ["obsidian", "ink-muted", 0.15],      // superficies oscuras
  "dim-light": ["glacial", "ink-muted", 0.73, { fondo: "glacial", min: 3.2, hacia: 1 }],   // texto "apagado" sobre claro (servicio próximamente)
  "on-dark-muted": ["glacial", "ink-muted", 0.25],    // texto secundario sobre oscuro
  "on-dark-faint": ["glacial", "ink-muted", 0.45],    // etiquetas sobre oscuro
  "dim-dark": ["obsidian", "glacial", 0.38, { fondo: "obsidian", min: 3.2, hacia: 1 }],   // pasos apagados de Método
  // Degradado de la portada y del contacto (violeta hacia el negro y hacia el blanco)
  "violet-night": ["violet", "#000000", 0.72],
  "violet-deep": ["violet", "#000000", 0.4],
  "lavender": ["violet-soft", "#FFFFFF", 0.55],
};
/* Tonos con transparencia: [color, opacidad] */
export const TRANSPARENTES = {
  "line": ["obsidian", 0.14],
  "line-dark": ["glacial", 0.16],
};

/* Contraste mínimo (WCAG AA): 4,5 texto normal, 3 texto grande.
   [texto, fondo, mínimo, qué es, cómo arreglarlo] */
export const CONTRASTES = [
  ["ink", "glacial", 4.5, "el texto principal sobre el blanco glacial", "Oscurece el negro obsidiana o aclara el blanco glacial."],
  ["ink", "glacial-2", 4.5, "el texto sobre las superficies claras", "Oscurece el negro obsidiana o aclara el blanco glacial."],
  ["ink-muted", "glacial", 4.5, "el gris de texto sobre el blanco glacial", "Oscurece el gris de texto."],
  ["violet", "glacial", 4.5, "el violeta sobre el blanco glacial (textos pequeños y botones)", "Oscurece el violeta eléctrico."],
  ["violet-soft", "obsidian", 4.5, "el violeta sobre oscuro encima del negro obsidiana", "Aclara el violeta sobre oscuro."],
  ["on-dark-muted", "obsidian", 4.5, "el texto secundario sobre oscuro", "Oscurece el negro obsidiana o aclara el gris de texto."],
  ["on-dark-faint", "obsidian", 4.5, "las etiquetas sobre oscuro", "Oscurece el negro obsidiana o aclara el gris de texto."],
  ["dim-dark", "obsidian", 3, "los pasos apagados de Método", "Aclara el blanco glacial u oscurece el negro obsidiana."],
  ["dim-light", "glacial", 3, "el texto apagado sobre claro (servicio «próximamente»)", "Oscurece el gris de texto."],
];

/* Panel (Sveltia CMS) */
export const PANEL = {
  repo: "syncrozkm37/Syncro",
  branch: "main",
  site: "https://syncro.syncro-studio.workers.dev",
};
