# Syncro

Web del estudio Syncro: branding y desarrollo web para negocios locales (Pontevedra).

**En producción:** https://syncro.syncro-studio.workers.dev

## Qué hay aquí

```
public/index.html          la home (marcado; ES/EN)
public/css/home.css        estilos de la home (tokens, secciones, responsive, movimiento reducido)
public/js/i18n.js          textos ES/EN (única fuente) y cambio de idioma
public/js/home.js          arranque (módulo ES) + CONTACT_EMAIL
public/js/modules/*.js     núcleo de movimiento y una pieza por sección
public/vendor/             GSAP 3.15.0 (ScrollTrigger, SplitText) y Lenis 1.3.26, fijados
public/fonts/              Montserrat variable 5.3.0 (latin + latin-ext), autoalojada
public/img/                texturas de marca, muro del hero, recortes, capturas (AVIF + WebP)
public/_headers            caché de Cloudflare: /vendor y /fonts un año; /img una semana
public/proyectos/          las cuatro webs modelo ya compiladas (Ferro, Olmo, Kaia, Marea)
wrangler.jsonc             configuración de Cloudflare Workers (Static Assets)
vercel.json                la misma web servida como estática en Vercel (pausado)
DESIGN-NOTES.md            decisiones del rediseño, inventario de movimiento y cómo ajustarlo
```

La home no necesita build: HTML, CSS y módulos ES servidos tal cual. Las librerías y la
fuente están autoalojadas (sin Google Fonts ni CDN).

## Webs modelo (/proyectos/)

Se abren desde los paneles de la sección Proyectos:

- https://syncro.syncro-studio.workers.dev/proyectos/ferro/
- https://syncro.syncro-studio.workers.dev/proyectos/olmo/
- https://syncro.syncro-studio.workers.dev/proyectos/kaia/
- https://syncro.syncro-studio.workers.dev/proyectos/marea/

**No se editan aquí.** El código fuente está en `Syncro1.1\WebsEjemplo`. Para actualizarlas:

```bash
cd ..\WebsEjemplo
npm run build:syncro     # compila y sustituye public/proyectos/ de esta carpeta
cd ..\syncro-cloudflare
npx wrangler@latest deploy
```

Llevan `noindex`: son negocios ficticios y no deben aparecer en Google.

## Identidad

- Negro obsidiana `#1C1C1C` · Púrpura eléctrico `#4915ED` · Blanco glacial `#F0F1FF`
- Montserrat en toda la web; Unbounded solo en el logo (SVG)
- Logos: los SVG originales del manual de identidad

## Probar en local

```bash
npx wrangler@latest dev
```

## Desplegar

```bash
npx wrangler@latest deploy
```

## Antes de tocar

- El email de contacto está en la constante `CONTACT_EMAIL` de `public/js/home.js`.
- Los textos en español e inglés están en el objeto `I18N` de `public/js/i18n.js`: cualquier
  texto con `data-i18n` se cambia en los dos idiomas.
- Si cambias una versión de GSAP, Lenis o Montserrat, cambia también el nombre de su carpeta
  (la caché de un año depende de ello).
- La landing anterior en Next.js sigue en el historial de git.
