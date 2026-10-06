/* =========================================================
   Portada: el degradado se mueve solo.
   Cada mancha (.hero__layer[data-drift]) deriva por un recorrido aleatorio y suave:
   desplazamiento, giro y escala salen de sumas de senos con fases al azar (distintas
   en cada visita) y cierran un bucle largo, así que la vuelta no se nota.
   Corre en el compositor (Web Animations sobre transform): no ocupa el hilo principal
   ni vuelve a pintar las capas. Fuera de pantalla se pausa.
   Movimiento reducido: no arranca y queda la imagen fija.
   ========================================================= */
import { reduce } from "./core.js";

/* Por capa: x / y en % de la propia capa, giro máximo en grados, escala máxima y bucle en segundos.
   La escala nunca baja de 1 y el resto cabe en el 12 % que sobra a cada lado de la capa, también en
   el peor caso (todo al máximo a la vez) y en pantallas de 360 px a ultrapanorámicas: nunca asoma un borde.
   Si se sube algo, comprobarlo (cuidado con el giro: en pantallas anchas desplaza mucho los extremos). */
const DRIFT = {
  glow:  { x: 3.5, y: 3,   r: 2.5, s: 1.12, loop: 26 },
  crown: { x: 4,   y: 2.5, r: 3,   s: 1.18, loop: 22 },
  band:  { x: 2.5, y: 4,   r: 3,   s: 1.08, loop: 30 },
  wave:  { x: 2.5, y: 3.5, r: 2,   s: 1.05, loop: 34 },
  lav:   { x: 4,   y: 4,   r: 5,   s: 1.22, loop: 20 },
};
const STEP = 0.4; // segundos entre fotogramas clave: el tramo recto entre dos no se aprecia

/* Recorrido periódico y suave: empieza en 0 (sin salto respecto a la imagen fija) y va de -1 a 1 */
function wander(n) {
  const terms = [1, 2, 3, 4].map((k) => ({ k, a: (0.35 + Math.random()) / k, p: Math.random() * 2 * Math.PI }));
  const raw = [];
  for (let i = 0; i <= n; i++) {
    raw.push(terms.reduce((s, { k, a, p }) => s + a * (Math.sin((2 * Math.PI * k * i) / n + p) - Math.sin(p)), 0));
  }
  const max = Math.max(...raw.map(Math.abs)) || 1;
  return raw.map((v) => v / max);
}

export function initHero() {
  const hero = document.getElementById("top");
  const layers = hero ? Array.from(hero.querySelectorAll(".hero__layer[data-drift]")) : [];
  if (reduce || !layers.length || !Element.prototype.animate) return;

  const anims = [];
  layers.forEach((el) => {
    const d = DRIFT[el.dataset.drift];
    if (!d) return;
    const n = Math.round(d.loop / STEP);
    const [x, y, r, sx, sy] = [wander(n), wander(n), wander(n), wander(n), wander(n)];
    const f = (v, k) => v.toFixed(k);
    const frames = x.map((_, i) => ({
      transform: `translate(${f(x[i] * d.x, 3)}%, ${f(y[i] * d.y, 3)}%) rotate(${f(r[i] * d.r, 3)}deg) ` +
        `scale(${f(1 + (d.s - 1) * sx[i] * sx[i], 4)}, ${f(1 + (d.s - 1) * sy[i] * sy[i], 4)})`,
    }));
    anims.push(el.animate(frames, { duration: d.loop * 1000, iterations: Infinity }));
  });

  // Fuera de pantalla, quieto (ahorra batería); al volver sigue donde lo dejó
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => anims.forEach((a) => (e.isIntersecting ? a.play() : a.pause()))).observe(hero);
  }
  // Para las capturas de QA: congelar el degradado en un instante (ms)
  if (window.__syncro) window.__syncro.heroAt = (ms) => anims.forEach((a) => { a.pause(); a.currentTime = ms; });
}
