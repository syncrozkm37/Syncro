/* =========================================================
   Portada: degradado líquido (WebGL)
   Un shader dibuja la composición de la maqueta (negro arriba, banda y luz violetas,
   ola blanca bajo el lema, lavanda abajo a la derecha) y la deforma sin parar con varias
   ondas que se arrastran unas a otras: fluye como tinta en agua.
   Con ratón, el líquido se deja arrastrar por el cursor y se abomba un poco bajo él.
   Siempre hay blanco bajo el lema y nunca blanco bajo el isotipo: los dos se leen siempre.
   Arranca quieto, igual que la imagen fija, y se despierta en un par de segundos.
   Debajo queda la versión fija en SVG: es lo que se ve al cargar, con movimiento reducido,
   sin WebGL o si la tarjeta gráfica pierde el contexto.
   Se pausa fuera de pantalla y, si el equipo va justo, baja la resolución sola.
   ========================================================= */
import { reduce } from "./core.js";

/* Ajustes */
const FLOW = 1;           // amplitud del líquido (0 = quieto)
const SPEED = 1;          // velocidad (1 = la de diseño)
const WAKE = 2.5;         // segundos que tarda en despertar desde la imagen fija
const MOUSE_DRAG = 0.16;  // cuánto arrastra el cursor al moverse
const MOUSE_LENS = 0.18;  // cuánto abomba bajo el cursor
const MOUSE_R = 240;      // radio de influencia del cursor (unidades de la maqueta)

const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

/* Unidades de la maqueta: 1690 × 1085 con y hacia abajo, encuadre «cubrir» (como el SVG) */
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time, u_flow;
uniform vec3 u_mouse;            // xy: cursor (unidades de la maqueta) · z: presencia 0..1
uniform vec2 u_vel;              // velocidad suavizada del cursor (unidades/s)
uniform vec4 u_text, u_iso;      // zonas del lema y del isotipo: x0 y0 x1 y1
uniform float u_top;             // borde inferior de la barra (unidades de la maqueta)
uniform vec3 u_base, u_violet, u_night, u_deep, u_lav, u_white;

float hash12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 hash22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float sig(float x){ return 1. / (1. + exp(-x)); }
// Borde difuminado como un desenfoque gaussiano de sigma s (sd < 0: dentro)
float soft(float sd, float s){ return 1. - smoothstep(-1.9 * s, 1.9 * s, sd); }
// Elipse difuminada (distancia aproximada a una elipse)
float ell(vec2 p, vec2 c, vec2 r, float s){
  vec2 d = p - c; float k0 = length(d / r), k1 = length(d / (r * r));
  return soft(k0 * (k0 - 1.) / max(k1, 1e-4), s);
}
float box(vec2 p, vec4 b){ vec2 c = .5 * (b.xy + b.zw), h = .5 * (b.zw - b.xy), q = abs(p - c) - h; return length(max(q, 0.)) + min(max(q.x, q.y), 0.); }

void main(){
  float s = max(u_res.x / 1690., u_res.y / 1085.);
  vec2 p = (vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y) - .5 * (u_res - vec2(1690., 1085.) * s)) / s;
  float t = u_time, f = u_flow;

  // 1 · Líquido: cinco ondas que se deforman unas a otras
  vec2 w = p / 320.;
  for (int i = 1; i < 6; i++) {
    float k = float(i);
    w.x += f * .36 / k * sin(k * 1.25 * w.y + t * (.55 + .12 * k) + k * 1.1);
    w.y += f * .31 / k * sin(k * 1.05 * w.x - t * (.45 + .10 * k) + k * 2.3);
  }
  vec2 q = w * 320.;

  // 2 · Cursor: arrastra el líquido al moverse y lo abomba debajo
  vec2 dm = p - u_mouse.xy;
  float fm = u_mouse.z * exp(-dot(dm, dm) / ${(2 * MOUSE_R * MOUSE_R).toFixed(1)});
  q -= (u_vel * ${MOUSE_DRAG.toFixed(3)} + dm * ${MOUSE_LENS.toFixed(3)}) * fm;

  // 3 · Pulverizado: cada píxel toma el color de un vecino al azar (fijo en pantalla, como el filtro del SVG)
  vec2 cell = mod(floor(gl_FragCoord.xy), 1024.);
  vec2 jit = (hash22(cell) + hash22(cell + 19.19) - 1.) * 50.;
  vec2 sp = q + jit, zp = p + jit;

  // 4 · Formas de la maqueta, que además derivan
  float glow = ell(sp, vec2(1720. + f * 70. * sin(t * .31), 420. + f * 110. * sin(t * .23 + 1.)), vec2(470., 660.) * (1. + f * .07 * sin(t * .41)), 95.);
  float crown = ell(sp, vec2(1640. + f * 60. * sin(t * .37 + 2.), 20. + f * 50. * sin(t * .29)), vec2(340., 200.), 95.);
  glow = 1. - (1. - glow) * (1. - crown);

  float gb = sig((sp.x - 820.) / 330.);
  float a1 = sp.x / 260. - t * .9, a2 = sp.x / 140. + t * .7 + 1.3;
  float yb = 300. + 700. * gb + f * (50. * sin(a1) + 26. * sin(a2));
  float db = 700. / 330. * gb * (1. - gb) + f * (50. / 260. * cos(a1) + 26. / 140. * cos(a2));
  float band = soft(abs(sp.y - yb) / sqrt(1. + db * db) - 105., 60.);
  float bx = clamp(sp.x / 1690., 0., 1.);
  vec3 bc = mix(mix(u_night, u_deep, clamp((bx - .3) / .25, 0., 1.)), u_violet, clamp((bx - .55) / .45, 0., 1.));
  float ba = mix(.25, 1., clamp(bx / .3, 0., 1.));

  float gw = sig((sp.x - 900.) / 400.);
  float c1 = sp.x / 300. - t * .7 + .5, c2 = sp.x / 160. + t * .55 + 2.1;
  float yw = 300. + 1000. * gw + f * (42. * sin(c1) + 22. * sin(c2));
  float dw = 1000. / 400. * gw * (1. - gw) + f * (42. / 300. * cos(c1) + 22. / 160. * cos(c2));
  float white = soft((yw - sp.y) / sqrt(1. + dw * dw), 16.);

  float lav = ell(sp, vec2(1700. + f * 70. * sin(t * .33), 1095. + f * 50. * sin(t * .27 + .7)), vec2(360., 190.), 60.);

  // 5 · Zonas fijas: blanco siempre bajo el lema; nunca blanco bajo la barra (logo y menú son claros);
  //     y el blanco que llegue al isotipo se vuelve violeta: un halo, para que el isotipo se lea siempre
  float zb = smoothstep(u_top, u_top + 160., zp.y);
  white = max(white, soft(box(zp, u_text), 40.)) * zb;
  lav *= zb;
  float halo = ell(p, .5 * (u_iso.xy + u_iso.zw), .5 * (u_iso.zw - u_iso.xy) * 1.25, 70.);
  float wi = white * halo, li = lav * halo;
  white -= wi; lav -= li;

  // 6 · Composición en el orden de la maqueta, grano y su luz (la imagen en trama consigo misma)
  vec3 c = u_base;
  c = mix(c, u_violet, glow);
  c = mix(c, bc, band * ba);
  c = mix(c, u_white, white);
  c = mix(c, u_lav, lav);
  c = mix(c, u_violet, max(wi, li));
  c = 1. - (1. - c) * (1. - c) * (1. - .035 * hash12(cell + 7.7));
  gl_FragColor = vec4(c, 1.);
}`;

export function initHero() {
  const hero = document.getElementById("top");
  const canvas = hero && hero.querySelector(".hero__fluid");
  if (reduce || !canvas) return;
  // Tras el primer pintado (el SVG fijo ya está en pantalla): compilar no retrasa la carga
  const start = () => { try { setup(hero, canvas); } catch (e) { console.error("[syncro] portada", e); } };
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 900 });
  else setTimeout(start, 120);
}

function setup(hero, canvas) {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
  if (!gl) return;
  const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  if (!hp || hp.precision < 16) return; // sin precisión alta el líquido se rompe: queda la imagen fija

  const compile = (type, src) => { const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh); return sh; };
  const vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  // Si el navegador compila en paralelo, se espera sin bloquear la página
  const par = gl.getExtension("KHR_parallel_shader_compile");
  const whenReady = () => (!par || gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR) ? run() : requestAnimationFrame(whenReady));
  whenReady();

  function run() {
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("[syncro] portada:", gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    ["u_res", "u_time", "u_flow", "u_mouse", "u_vel", "u_text", "u_iso", "u_top", "u_base", "u_violet", "u_night", "u_deep", "u_lav", "u_white"]
      .forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

    /* Colores: los de la paleta (los escribe el build en :root desde el panel), como en el SVG */
    const cs = getComputedStyle(document.documentElement);
    const hex = (n) => { const v = cs.getPropertyValue("--" + n).trim(); return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16) / 255); };
    const mix = (x, y, k) => x.map((v, i) => v * (1 - k) + y[i] * k);
    gl.uniform3fv(U.u_base, mix(hex("obsidian"), [0, 0, 0], 0.7));
    gl.uniform3fv(U.u_violet, hex("violet"));
    gl.uniform3fv(U.u_night, hex("violet-night"));
    gl.uniform3fv(U.u_deep, hex("violet-deep"));
    gl.uniform3fv(U.u_lav, hex("lavender"));
    gl.uniform3fv(U.u_white, mix(hex("glacial"), [1, 1, 1], 0.7));

    /* Tamaño: hasta 2× la densidad de la pantalla y un máximo de píxeles por fotograma */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let budget = fine ? 1.2e6 : 0.75e6;
    let map = { s: 1, ox: 0, oy: 0 };
    const toU = (x, y) => [(x - map.ox) / map.s, (y - map.oy) / map.s];
    const iso = hero.querySelector(".hero__iso");
    const texts = Array.from(hero.querySelectorAll(".hero__title, .hero__sub"));
    function zones() {
      const hr = hero.getBoundingClientRect();
      const rect = (rs, pad) => {
        const x0 = Math.min(...rs.map((r) => r.left)), y0 = Math.min(...rs.map((r) => r.top));
        const x1 = Math.max(...rs.map((r) => r.right)), y1 = Math.max(...rs.map((r) => r.bottom));
        return [...toU(x0 - hr.left - pad, y0 - hr.top - pad), ...toU(x1 - hr.left + pad, y1 - hr.top + pad)];
      };
      // Del lema cuenta lo que ocupa el texto, no la caja entera
      const lines = texts.map((el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect(); });
      gl.uniform4fv(U.u_text, rect(lines, 18));
      gl.uniform4fv(U.u_iso, rect([iso.getBoundingClientRect()], 12));
      const nav = document.getElementById("nav");
      gl.uniform1f(U.u_top, toU(0, (nav ? nav.offsetHeight : 80) + 10)[1]);
    }
    function size() {
      const W = hero.clientWidth, H = hero.clientHeight;
      const k = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(budget / (W * H)));
      canvas.width = Math.max(1, Math.round(W * k));
      canvas.height = Math.max(1, Math.round(H * k));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.u_res, canvas.width, canvas.height);
      const s = Math.max(W / 1690, H / 1085);
      map = { s, ox: (W - 1690 * s) / 2, oy: (H - 1085 * s) / 2 };
      zones();
    }
    size();
    let resizing = 0;
    window.addEventListener("resize", () => { cancelAnimationFrame(resizing); resizing = requestAnimationFrame(size); });
    document.addEventListener("syncro:lang", () => requestAnimationFrame(zones));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(zones);
    iso.addEventListener("animationend", zones);

    /* Cursor (solo con ratón): posición y velocidad suavizadas, presencia que entra y sale */
    let tx = 0, ty = 0, mx = 0, my = 0, vx = 0, vy = 0, pres = 0, want = 0, seen = false;
    if (fine) {
      window.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        want = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0;
        if (!want) return;
        [tx, ty] = toU(e.clientX - r.left, e.clientY - r.top);
        if (!seen) { mx = tx; my = ty; seen = true; }
      }, { passive: true });
      window.addEventListener("mouseout", (e) => { if (!e.relatedTarget) want = 0; });
    }

    /* Bucle: como mucho ~70 fotogramas por segundo; si va lento, menos píxeles */
    let raf = 0, on = false, last = 0, live = false, slow = 0, frames = 0;
    let t = Math.random() * 600, woke = 0; // cada visita, un momento distinto del líquido
    const ease = (x) => x * x * (3 - 2 * x);
    function draw(dt) {
      woke = Math.min(WAKE, woke + dt);
      t += dt * SPEED;
      const kp = 1 - Math.exp(-dt * 10), kv = 1 - Math.exp(-dt * 6);
      const nx = mx + (tx - mx) * kp, ny = my + (ty - my) * kp;
      vx += ((nx - mx) / dt - vx) * kv; vy += ((ny - my) / dt - vy) * kv;
      const sp = Math.hypot(vx, vy); if (sp > 1600) { vx *= 1600 / sp; vy *= 1600 / sp; }
      mx = nx; my = ny;
      pres += (want - pres) * (1 - Math.exp(-dt * 4));
      gl.uniform1f(U.u_time, t);
      gl.uniform1f(U.u_flow, FLOW * ease(woke / WAKE));
      gl.uniform3f(U.u_mouse, mx, my, pres);
      gl.uniform2f(U.u_vel, vx, vy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!live) { live = true; hero.classList.add("is-live"); }
    }
    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (last && now - last < 1000 / 75) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      draw(dt);
      slow += dt; frames++;
      if (frames === 90) {
        if (slow / frames > 1 / 40 && budget > 3e5) { budget *= 0.7; size(); }
        slow = 0; frames = 0;
      }
    }
    const play = () => { if (!on) { on = true; last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { on = false; cancelAnimationFrame(raf); };
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop())).observe(hero);
    else play();

    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); stop(); hero.classList.remove("is-live"); });

    // Para las capturas de QA: congelar el líquido en un instante (segundos), ya despierto;
    // m = { x, y, vx, vy } fija el cursor (px de la portada) y su velocidad (px/s); still = el fotograma inicial, aún quieto
    if (window.__syncro) window.__syncro.heroAt = (sec, m, still) => {
      stop(); woke = still ? 0 : WAKE; t = sec;
      if (m) { [tx, ty] = toU(m.x, m.y); mx = tx; my = ty; vx = (m.vx || 0) / map.s; vy = (m.vy || 0) / map.s; pres = want = 1; }
      draw(1 / 60);
    };
  }
}
