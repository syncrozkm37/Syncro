/* =========================================================
   Syncro — Worker
   La web es estática (public/) y Cloudflare la sirve sin pasar por aquí.
   Este Worker solo recibe:
   - Rutas que no existen como archivo: responde el 404 de siempre.
   - /_panel/*: 404. Los archivos del panel no se sirven por su ruta real.
   - La ruta secreta del panel (secreto PANEL_PATH): pide contraseña
     (secreto PANEL_PASSWORD, autenticación básica) y sirve /_panel/.
   Sin los dos secretos (o si son demasiado cortos) el panel no existe: 404.

   Secretos (no están en el repositorio, que es público):
     npx wrangler secret put PANEL_PATH       p. ej. una cadena aleatoria de 20+ caracteres
     npx wrangler secret put PANEL_PASSWORD   mínimo 12 caracteres
   ========================================================= */

const PANEL_DIR = "/_panel/";
const MIN_RUTA = 12, MIN_CLAVE = 12;

const SEGURIDAD = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",               // que la ruta secreta no viaje a GitHub ni a otros sitios
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const base = rutaPanel(env);
    if (base && (url.pathname === base || url.pathname.startsWith(base + "/"))) return panel(request, env, url, base);
    // /_panel/* por su ruta real, o cualquier ruta que no existe: el 404 normal de la web
    if (url.pathname === "/_panel" || url.pathname.startsWith(PANEL_DIR)) return noExiste(request, env);
    return env.ASSETS.fetch(request);
  },
};

/* "/ruta-secreta" si los secretos están bien puestos; si no, null (panel desactivado) */
function rutaPanel(env) {
  const slug = String(env.PANEL_PATH || "").replace(/^\/+|\/+$/g, "");
  if (!slug || !env.PANEL_PASSWORD) return null;
  if (slug.length < MIN_RUTA || !/^[A-Za-z0-9_-]+$/.test(slug) || String(env.PANEL_PASSWORD).length < MIN_CLAVE) {
    console.warn(`Panel desactivado: PANEL_PATH necesita ${MIN_RUTA}+ caracteres (letras, números, - o _) y PANEL_PASSWORD ${MIN_CLAVE}+.`);
    return null;
  }
  return "/" + slug;
}

function noExiste(request, env) {
  return env.ASSETS.fetch(new Request(new URL("/__no-existe__", request.url), { method: "GET" }));
}

async function panel(request, env, url, base) {
  if (request.headers.has("Authorization")) {
    // Límite de intentos por IP (20 por minuto): una contraseña no se puede adivinar a fuerza de probar
    if (env.PANEL_LIMIT) {
      const { success } = await env.PANEL_LIMIT.limit({ key: request.headers.get("CF-Connecting-IP") || "local" });
      if (!success) return conCabeceras(new Response("Demasiados intentos. Espera un minuto.", { status: 429, headers: { "Retry-After": "60", "Content-Type": "text/plain; charset=utf-8" } }));
    }
    if (await claveCorrecta(request, env.PANEL_PASSWORD)) {
      if (url.pathname === base) return conCabeceras(Response.redirect(new URL(base + "/" + url.search, url), 308));
      const destino = new URL(PANEL_DIR + url.pathname.slice(base.length + 1) + url.search, url);
      const res = await env.ASSETS.fetch(new Request(destino, request));
      // Si el servidor de archivos redirige (barra final), la redirección apunta a la ruta secreta
      const loc = res.headers.get("Location");
      if (res.status >= 300 && res.status < 400 && loc) {
        const l = new URL(loc, destino);
        if (l.pathname.startsWith(PANEL_DIR)) return conCabeceras(Response.redirect(new URL(base + "/" + l.pathname.slice(PANEL_DIR.length) + l.search, url), res.status));
      }
      return conCabeceras(res);
    }
  }
  return conCabeceras(new Response("Acceso restringido.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Syncro", charset="UTF-8"', "Content-Type": "text/plain; charset=utf-8" },
  }));
}

/* Autenticación básica: vale cualquier usuario; la contraseña se compara en tiempo constante */
async function claveCorrecta(request, esperada) {
  const m = (request.headers.get("Authorization") || "").match(/^Basic\s+([A-Za-z0-9+/=]+)$/i);
  if (!m) return false;
  let texto;
  try { texto = new TextDecoder().decode(Uint8Array.from(atob(m[1]), (c) => c.charCodeAt(0))); } catch { return false; }
  const i = texto.indexOf(":");
  if (i < 0) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([texto.slice(i + 1), String(esperada)].map((s) => crypto.subtle.digest("SHA-256", enc.encode(s))));
  return crypto.subtle.timingSafeEqual(a, b);
}

function conCabeceras(res) {
  const r = new Response(res.body, res);
  for (const [k, v] of Object.entries(SEGURIDAD)) r.headers.set(k, v);
  return r;
}
