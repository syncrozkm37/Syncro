/* =========================================================
   Build: genera la web a partir de content/ (lo que se edita en el panel).
   - public/index.html          textos en español, <title>, descripción y theme-color
   - public/js/i18n.js          diccionario ES/EN (entre las marcas @generado:textos)
   - public/css/home.css        colores (entre las marcas @generado:colores)
   - public/favicon.svg         el isotipo en el violeta
   - public/_panel/config.yml   configuración del panel (sale de scripts/contenido.mjs)
   Antes lo comprueba todo (textos completos, límites, asteriscos, contrastes).
   Si algo falla no escribe nada y termina con error: Cloudflare no publica
   y la web sigue como estaba.

   Uso: node scripts/build.mjs            (lo lanza wrangler deploy/dev solo)
        node scripts/build.mjs --check    (solo comprobar)
   Sin dependencias: solo Node.
   ========================================================= */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LOCALES, SECCIONES, COMPUESTAS, COLORES, DERIVADOS, TRANSPARENTES, CONTRASTES, PANEL, campo } from "./contenido.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (rel) => path.join(ROOT, rel);
const soloComprobar = process.argv.includes("--check");
const errores = [];
const error = (m) => errores.push(m);

/* ---------- Utilidades ---------- */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");
const largo = (s) => [...s].length;
function leerJSON(rel) {
  try { return JSON.parse(fs.readFileSync(P(rel), "utf8")); }
  catch (e) { error(`${rel}: no se puede leer (${e.message})`); return null; }
}

/* ---------- 1. Textos ---------- */
const GLYPH = '<svg class="glyph" viewBox="0 0 369.818 259.627" aria-hidden="true"><use href="#isotipo"/></svg>';
// *así* → en violeta: <em> en los titulares, <span class="hl"> en el manifiesto
const conVioleta = (s, modo) => esc(s).replace(/\*([^*]+)\*/g, modo === "hl" ? '<span class="hl">$1</span>' : "<em>$1</em>");
// Cómo se montan las claves compuestas a partir de sus partes (ya en HTML)
const COMPONER = {
  "hero.title": ([l1, l2, l3]) =>
    `<span class="ln"><span>${l1}</span></span><span class="ln ln--indent"><span>${GLYPH}${l2}</span></span><span class="ln"><span>${l3}</span></span>`,
};

const dict = Object.fromEntries(LOCALES.map((l) => [l, {}]));
const esHtml = new Set();                       // claves cuyo valor es HTML (data-i18n-html)
for (const sec of SECCIONES) {
  const data = leerJSON(`content/textos/${sec.file}.json`);
  if (!data) continue;
  for (const lang of LOCALES) {
    const vals = data[lang] || {};
    for (const f of sec.fields) {
      const donde = `Textos › ${sec.label} › ${f.label} (${lang.toUpperCase()})`;
      let v = vals[campo(f.key)];
      if (typeof v !== "string" || !v.trim()) { error(`${donde}: está vacío.`); continue; }
      v = v.trim().replace(/\s*\n\s*/g, " ");     // texto plano en una línea
      if (largo(v) > f.max) error(`${donde}: tiene ${largo(v)} caracteres y el máximo es ${f.max}.`);
      if (f.violeta && (v.split("*").length - 1) % 2) error(`${donde}: hay un asterisco sin cerrar.`);
      if (f.violeta) esHtml.add(f.key);
      dict[lang][f.key] = f.violeta ? conVioleta(v, f.violeta) : v;
    }
  }
}
for (const [key, partes] of Object.entries(COMPUESTAS)) {
  for (const lang of LOCALES) {
    const vals = partes.map((p) => dict[lang][p]);
    if (vals.every((v) => v != null)) dict[lang][key] = COMPONER[key](vals);
    partes.forEach((p) => delete dict[lang][p]);
  }
  partes.forEach((p) => esHtml.delete(p));
  esHtml.add(key);
}

/* ---------- 2. Colores ---------- */
const HEX = /^#[0-9A-Fa-f]{6}$/;
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const aHex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
const lum = (h) => {
  const [r, g, b] = rgb(h).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const num = (n) => n.toFixed(1).replace(".", ",");

const pal = {};
const colores = leerJSON("content/colores.json") || {};
for (const c of COLORES) {
  const v = typeof colores[c.name] === "string" ? colores[c.name].trim() : "";
  if (!HEX.test(v)) { error(`Colores › ${c.label}: «${colores[c.name] ?? ""}» no es un color #RRGGBB.`); continue; }
  pal[c.token] = v.toUpperCase();
}
const baseCompleta = Object.keys(pal).length === COLORES.length;
if (baseCompleta) {
  const col = (n) => (n.startsWith("#") ? n : pal[n]);
  for (const [name, [a, b, t0, ajuste]] of Object.entries(DERIVADOS)) {
    const A = rgb(col(a)), B = rgb(col(b));
    const mezcla = (t) => aHex(A.map((v, i) => v * (1 - t) + B[i] * t));
    let t = t0;
    // Si no llega al contraste mínimo, se acerca a "hacia" lo justo (búsqueda binaria)
    if (ajuste && contraste(mezcla(t0), pal[ajuste.fondo]) < ajuste.min) {
      let lo = t0, hi = ajuste.hacia;
      if (contraste(mezcla(hi), pal[ajuste.fondo]) >= ajuste.min) {
        for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (contraste(mezcla(m), pal[ajuste.fondo]) >= ajuste.min) hi = m; else lo = m; }
      }
      t = hi;
    }
    pal[name] = mezcla(t);
  }
  for (const [fg, bg, min, que, arreglo] of CONTRASTES) {
    const r = contraste(pal[fg], pal[bg]);
    if (r < min - 1e-9) error(`Colores: ${que} tiene un contraste de ${num(r)}:1 y necesita al menos ${num(min)}:1 (${pal[fg]} sobre ${pal[bg]}). ${arreglo}`);
  }
}

/* ---------- 3. Salidas ---------- */
const salidas = [];   // [ruta relativa, contenido nuevo]
function reescribir(rel, fn) {
  const orig = fs.readFileSync(P(rel), "utf8");
  const crlf = orig.includes("\r\n");
  let s = fn(crlf ? orig.replace(/\r\n/g, "\n") : orig);
  if (s == null) return;
  if (crlf) s = s.replace(/\n/g, "\r\n");
  salidas.push([rel, s, orig]);
}
function entreMarcas(s, marca, dentro, rel) {
  const re = new RegExp(`(^[ \\t]*[/*]+ @generado:${marca}[^\\n]*\\n)[\\s\\S]*?(^[ \\t]*[/*]+ @fin:${marca}[^\\n]*$)`, "m");
  if (!re.test(s)) { error(`${rel}: faltan las marcas @generado:${marca} / @fin:${marca}.`); return s; }
  return s.replace(re, (_, a, b) => a + dentro + b);
}

// Cierre de una etiqueta, contando anidadas del mismo tipo
function cierre(html, tag, desde) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  re.lastIndex = desde;
  let prof = 1, m;
  while ((m = re.exec(html))) {
    if (m[1]) { if (--prof === 0) return m.index; }
    else if (!m[0].endsWith("/>")) prof++;
  }
  return -1;
}

if (!errores.length) {
  const es = dict.es;

  /* index.html: el HTML lleva el español dentro (para Google y sin JavaScript) */
  reescribir("public/index.html", (html) => {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(es["meta.title"])}</title>`);
    html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${escAttr(es["meta.desc"])}$2`);
    html = html.replace(/(<meta name="theme-color" content=")[^"]*(")/, `$1${pal.obsidian}$2`);
    html = html.replace(/<[a-zA-Z][^>]*\sdata-i18n-attr="([^"]+)"[^>]*>/g, (tag, spec) => {
      for (const par of spec.split(",")) {
        const [attr, key] = par.split(":");
        if (es[key] == null) { error(`index.html usa «${key}» (atributo ${attr}) y no está en content/.`); continue; }
        const re = new RegExp(`(\\s${attr}=")[^"]*(")`);
        tag = re.test(tag) ? tag.replace(re, `$1${escAttr(es[key])}$2`) : tag.replace(/\s*\/?>$/, (fin) => ` ${attr}="${escAttr(es[key])}"${fin}`);
      }
      return tag;
    });
    const re = /<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?\sdata-i18n(-html)?="([^"]+)"[^>]*>/g;
    let out = "", ultimo = 0, m;
    while ((m = re.exec(html))) {
      const [abre, tag, html_, key] = m;
      const ini = m.index + abre.length, fin = cierre(html, tag, ini);
      if (fin < 0) { error(`index.html: no encuentro el cierre de <${tag} data-i18n="${key}">.`); continue; }
      if (es[key] == null) { error(`index.html usa «${key}» y no está en content/.`); continue; }
      if (!!html_ !== esHtml.has(key)) error(`index.html: «${key}» ${html_ ? "va con data-i18n-html pero es texto plano" : "va con data-i18n pero lleva violeta (usa data-i18n-html)"}.`);
      out += html.slice(ultimo, ini) + (html_ ? es[key] : esc(es[key]));
      ultimo = fin;
      re.lastIndex = fin;
    }
    return out + html.slice(ultimo);
  });

  /* i18n.js: el diccionario completo (el español hace falta para volver desde el inglés) */
  reescribir("public/js/i18n.js", (s) => {
    const cuerpo = JSON.stringify(dict, null, 2).replace(/\n/g, "\n  ");
    return entreMarcas(s, "textos", `  var I18N = ${cuerpo};\n`, "public/js/i18n.js");
  });

  /* home.css: la paleta */
  reescribir("public/css/home.css", (s) => {
    const nombre = Object.fromEntries(COLORES.map((c) => [c.token, c.label]));
    const lineas = [
      ...COLORES.map((c) => `  --${c.token}:${pal[c.token]};${" ".repeat(Math.max(1, 14 - c.token.length))}/* ${nombre[c.token]} (panel) */`),
      "  /* Derivados: se calculan a partir de los cinco de arriba (scripts/contenido.mjs › DERIVADOS) */",
      ...Object.keys(DERIVADOS).map((n) => `  --${n}:${pal[n]};`),
      ...Object.entries(TRANSPARENTES).map(([n, [c, a]]) => `  --${n}:rgba(${rgb(pal[c]).join(",")},${String(a).replace(/^0/, "")});`),
    ];
    return entreMarcas(s, "colores", lineas.join("\n") + "\n", "public/css/home.css");
  });

  /* favicon: el isotipo en el violeta */
  reescribir("public/favicon.svg", (s) => s.replace(/fill="#[0-9A-Fa-f]{6}"/, `fill="${pal.violet.toLowerCase()}"`));

  /* Configuración del panel (YAML: un JSON es YAML válido) */
  const config = {
    backend: { name: "github", repo: PANEL.repo, branch: PANEL.branch, commit_messages: { update: "Panel: {{collection}} · {{slug}}" } },
    site_url: PANEL.site,
    display_url: PANEL.site,
    logo_url: "/favicon.svg",
    media_folder: "public/img/panel",
    public_folder: "/img/panel",
    i18n: { structure: "single_file", locales: LOCALES, default_locale: "es" },
    editor: { preview: false },
    collections: [
      {
        name: "textos", label: "Textos", label_singular: "Texto", i18n: true,
        description: "Los textos de la web en español e inglés. En los titulares, lo que pongas entre \\*asteriscos\\* sale en violeta. Al guardar, la web se actualiza sola en uno o dos minutos.",
        files: SECCIONES.map((sec) => ({
          name: sec.file, label: sec.label, file: `content/textos/${sec.file}.json`, format: "json", i18n: true,
          fields: sec.fields.map((f) => ({
            name: campo(f.key), label: f.label, widget: f.largo ? "text" : "string", i18n: true, required: true, maxlength: f.max,
            ...(f.hint ? { hint: f.hint } : {}),
          })),
        })),
      },
      {
        name: "colores", label: "Colores", label_singular: "Colores",
        description: "Los cinco colores de la web; el resto de tonos se calculan solos. Si un color no contrasta lo suficiente con su fondo, el cambio no se publica y la web sigue como estaba.",
        files: [{
          name: "colores", label: "Colores de la web", file: "content/colores.json", format: "json",
          fields: COLORES.map((c) => ({ name: c.name, label: c.label, widget: "color", allowInput: true, required: true, hint: c.hint })),
        }],
      },
    ],
  };
  const yml = "# Configuración del panel de contenido (Sveltia CMS).\n# La genera scripts/build.mjs a partir de scripts/contenido.mjs: no editar a mano.\n" + JSON.stringify(config, null, 2) + "\n";
  const cfgRel = "public/_panel/config.yml";
  const cfgOrig = fs.existsSync(P(cfgRel)) ? fs.readFileSync(P(cfgRel), "utf8") : null;
  salidas.push([cfgRel, yml, cfgOrig]);
}

/* ---------- 4. Resultado ---------- */
if (errores.length) {
  console.error(`\n✗ No se ha generado la web: ${errores.length} problema${errores.length > 1 ? "s" : ""}\n`);
  errores.forEach((e) => console.error("  · " + e));
  console.error("\nCorrígelo en el panel (o en content/) y vuelve a guardar. La web publicada no ha cambiado.\n");
  process.exit(1);
}
const cambiados = salidas.filter(([, nuevo, orig]) => nuevo !== orig);
if (!soloComprobar) for (const [rel, nuevo] of cambiados) { fs.mkdirSync(path.dirname(P(rel)), { recursive: true }); fs.writeFileSync(P(rel), nuevo); }
const nClaves = Object.keys(dict.es).length;
console.log(`✓ Contenido correcto: ${nClaves} textos × ${LOCALES.length} idiomas, ${COLORES.length} colores (contrastes AA).`);
console.log(cambiados.length
  ? `${soloComprobar ? "Cambiarían" : "Actualizado"}: ${cambiados.map(([rel]) => rel).join(", ")}`
  : "Sin cambios.");
