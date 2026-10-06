# Syncro

Web del estudio Syncro: branding y desarrollo web para negocios locales (Pontevedra).

**En producción:** https://syncro.syncro-studio.workers.dev

## Qué hay aquí

```
content/textos/*.json      TEXTOS de la web en ES/EN, una sección por archivo (se editan en el panel)
content/colores.json       los cinco COLORES editables (se editan en el panel)
scripts/contenido.mjs      qué se puede editar: campos, límites, colores derivados y contrastes mínimos
scripts/build.mjs          genera la web a partir de content/ y lo comprueba todo (lo lanza wrangler solo)
worker/index.js            Worker mínimo: ruta secreta + contraseña del panel
public/index.html          la home (marcado; ES/EN)
public/css/home.css        estilos de la home (la paleta de :root la escribe el build)
public/js/i18n.js          cambio de idioma (el diccionario lo escribe el build)
public/js/home.js          arranque (módulo ES) + CONTACT_EMAIL
public/js/modules/*.js     scroll suave, navegación, portada animada, apariciones suaves, Método y Planes, email
public/_panel/             el panel (Sveltia CMS): solo se sirve por la ruta secreta
public/vendor/             Lenis 1.3.26 (scroll suave), GSAP 3.15.0 (actos de Método) y Sveltia CMS 0.224.0 (panel), fijados
public/fonts/              Unbounded y Montserrat variables 5.3.0 (latin + latin-ext), autoalojadas
public/img/                capturas de los proyectos (AVIF + WebP)
public/_headers            caché de Cloudflare: /vendor y /fonts un año; /img una semana
public/proyectos/          las cuatro webs modelo ya compiladas (Ferro, Olmo, Kaia, Marea)
wrangler.jsonc             configuración de Cloudflare Workers (Static Assets + Worker + build)
vercel.json                la misma web servida como estática en Vercel (pausado)
DESIGN-NOTES.md            decisiones del rediseño, inventario de movimiento y cómo ajustarlo
```

La web sigue siendo estática: HTML, CSS y módulos ES servidos tal cual, sin framework. El único
paso previo es `scripts/build.mjs`, que escribe los textos y los colores desde `content/` (solo Node,
sin dependencias). Las librerías y la fuente están autoalojadas (sin Google Fonts ni CDN).

## Panel de contenido

Desde el panel se editan **los textos (español e inglés) y los cinco colores** de la web.
Cada cambio que guardas es un commit en GitHub (`main`); Cloudflare vuelve a generar la web y la
publica sola en uno o dos minutos. Todo queda en el historial de git: para deshacer, se revierte el commit.

**Cómo se entra**

1. Abre la ruta secreta: `https://syncro.syncro-studio.workers.dev/<ruta secreta>/`.
   No está en este repositorio (es público): vive como secreto en Cloudflare.
2. El navegador pide usuario y contraseña: el usuario da igual (pon tu nombre); la contraseña
   es la del panel. Tras 20 intentos por minuto desde la misma IP, espera un minuto.
3. En el panel: **«Iniciar sesión con un token de acceso»** y pega tu token de GitHub
   (ver abajo). Se guarda en ese navegador; no hay que repetirlo.
   El botón «Iniciar sesión con GitHub» no está configurado (necesitaría una app OAuth).

**Tu token de GitHub** (uno por persona; da permiso de escritura en el repositorio):

- Cuenta dueña del repositorio (`syncrozkm37`): token *fine-grained* solo para `syncrozkm37/Syncro`
  con **Contents: Read and write**.
- Colaboradores: token *classic* con el permiso **`public_repo`** (los fine-grained no sirven para
  repositorios de otra cuenta personal).
- En GitHub: Settings → Developer settings → Personal access tokens.

**Poner o cambiar la ruta secreta y la contraseña** (desde esta carpeta):

```bash
npx wrangler secret put PANEL_PATH
```

```bash
npx wrangler secret put PANEL_PASSWORD
```

- `PANEL_PATH`: 12 caracteres o más (letras, números, `-` o `_`), sin barras. Por ejemplo, genera una con
  `node -e "console.log(require('crypto').randomBytes(12).toString('base64url'))"`.
- `PANEL_PASSWORD`: 12 caracteres o más (mejor la de un gestor de contraseñas).
- Si falta alguno de los dos o es demasiado corto, el panel no existe (la ruta da 404).
- Guarda la dirección completa del panel y la contraseña en vuestro gestor de contraseñas.

**Qué protege a quién**

- La ruta secreta + la contraseña: para ver el panel. Además, `noindex`, sin caché y sin enviar la
  ruta a otros sitios (`Referrer-Policy: no-referrer`).
- El token de GitHub: para leer y guardar. Sin permiso de escritura en el repo no se puede cambiar nada.
- Los archivos del panel no se sirven por su ruta real (`/_panel/` da 404).

**Qué comprueba el build antes de publicar** (si algo falla, no se publica y la web sigue igual):
que no falte ningún texto en ninguno de los dos idiomas, los límites de caracteres, que los
`*asteriscos*` estén cerrados y que los colores tengan contraste suficiente (WCAG AA). El motivo
aparece en el registro del build en Cloudflare (Workers & Pages → syncro → Deployments).

**Publicación automática** (se configura una vez): conecta el repositorio a Cloudflare Workers Builds
en Workers & Pages → syncro → Settings → Build → Connect, con la rama `main` y el comando de
despliegue `npx wrangler deploy`. Tiene que autorizarlo la cuenta dueña del repositorio
(`syncrozkm37`). Sin esa conexión, los cambios del panel llegan a GitHub pero hay que publicar a mano
(`git pull` y `npx wrangler@latest deploy`).

**Escribir en el panel**

- En los titulares, lo que va entre `*asteriscos*` sale en violeta: `Que te *elijan.*`
- Los textos son texto plano: sin HTML. Cada campo muestra su límite de caracteres.
- Algunos textos salen en más de un sitio (lo dice su pista), p. ej. «Servicio 2 · título» es también
  el nombre del plan 2.

**Añadir un texto nuevo** (lo hace quien programa): añádelo en `scripts/contenido.mjs`, pon
`data-i18n="clave"` en el HTML, escribe su valor en `content/textos/<sección>.json` (es y en) y
ejecuta `node scripts/build.mjs`. El panel lo muestra en cuanto se publica.

## Webs modelo (/proyectos/)

Se abren desde los paneles de la sección Proyectos:

- https://syncro.syncro-studio.workers.dev/proyectos/ferro/
- https://syncro.syncro-studio.workers.dev/proyectos/olmo/
- https://syncro.syncro-studio.workers.dev/proyectos/kaia/
- https://syncro.syncro-studio.workers.dev/proyectos/marea/

**No se editan aquí** (ni desde el panel). El código fuente está en `Syncro1.1\WebsEjemplo`. Para actualizarlas:

```bash
cd ..\WebsEjemplo
npm run build:syncro     # compila y sustituye public/proyectos/ de esta carpeta
cd ..\syncro-cloudflare
npx wrangler@latest deploy
```

Llevan `noindex`: son negocios ficticios y no deben aparecer en Google.

## Identidad

- Negro obsidiana `#1C1C1C` · Púrpura eléctrico `#4915ED` · Blanco glacial `#F0F1FF`
  (los valores vivos están en `content/colores.json`)
- Unbounded en títulos, menú y botones; Montserrat en el texto (como dice el manual de marca)
- Logos: los SVG originales del manual de identidad

## Probar en local

```bash
npx wrangler@latest dev
```

Para probar también el panel en local, copia `.dev.vars.example` como `.dev.vars` con valores de prueba.

## Desplegar

```bash
npx wrangler@latest deploy
```

Antes de desplegar, wrangler ejecuta `node scripts/build.mjs`; si el contenido no pasa las
comprobaciones, no despliega.

## Antes de tocar

- **Los textos y los colores no se editan en `index.html`, `i18n.js` ni `home.css`**: el build los
  sobrescribe desde `content/`. Edítalos en el panel o en `content/`.
- Los archivos generados que hay en el repositorio pueden ir por detrás de `content/` (el panel solo
  guarda los JSON); se regeneran en cada build.
- El email de contacto está en la constante `CONTACT_EMAIL` de `public/js/home.js`.
- Si cambias una versión de Lenis, Sveltia CMS, Unbounded o Montserrat, cambia también el nombre de su
  carpeta (la caché de un año depende de ello) y la ruta en el HTML.
- La landing anterior en Next.js sigue en el historial de git.
