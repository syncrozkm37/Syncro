/* =========================================================
   03 · Proyectos (claro): carrusel horizontal libre
   La página baja con normalidad: la sección no se queda fija ni obliga a ver los seis paneles.
   En horizontal se mueve solo si se quiere:
   - trackpad o dedo: scroll nativo con encaje (scroll-snap). Lenis deja pasar los gestos
     horizontales gracias a data-lenis-prevent-horizontal en el HTML;
   - ratón: arrastrar (al soltar encaja; un arrastre rápido lanza al siguiente) o Mayúsculas + rueda;
   - flechas: los botones y, con el carrusel enfocado, ← → Inicio y Fin.
   El contador, la barra y los botones siguen el avance. Dentro de cada panel, navegador, móvil y
   nombre corren a distinto ritmo: aquí solo se calcula --t por panel (0 en su sitio, 1 un panel a
   la derecha, -1 uno a la izquierda) y el CSS mueve las capas.
   Movimiento reducido: sin profundidad y sin animar los saltos. Sin JavaScript: carrusel nativo.
   ========================================================= */
import { reduce } from "./core.js";

const DRAG_MIN = 5;      // px que hay que mover el ratón para que cuente como arrastre (y no como clic)
const FLICK = 0.15;      // arrastrando más de esta parte de un panel, al soltar se pasa al siguiente
const FLING = 180;       // ms de inercia al soltar: cuánto «lanza» un arrastre rápido (como mucho, un panel)
const ARRIVE = 1500;     // ms máximos que se espera a que un salto llegue a su panel

export function initWork() {
  const sec = document.getElementById("proyectos");
  if (!sec) return;
  const track = sec.querySelector(".work__track");
  const panels = Array.from(track.querySelectorAll(".wp"));
  const n = panels.length;
  if (!n) return;
  const count = sec.querySelector("#work-i");
  const total = sec.querySelector("#work-n");
  const bar = sec.querySelector("#work-bar");
  const prev = sec.querySelector("#work-prev");
  const next = sec.querySelector("#work-next");
  const behavior = reduce ? "auto" : "smooth";
  const pad2 = (i) => String(i).padStart(2, "0");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let starts = [], step = 1, max = 0;   // dónde encaja cada panel (scrollLeft), un paso y el tope
  let active = -1, target = null, ticking = false;
  const lastT = panels.map(() => NaN);
  if (total) total.textContent = pad2(n);

  function measure() {
    const x0 = panels[0].offsetLeft;
    max = Math.max(0, track.scrollWidth - track.clientWidth);
    step = n > 1 ? Math.max(1, panels[1].offsetLeft - x0) : 1;
    starts = panels.map((p) => Math.min(max, p.offsetLeft - x0));
  }

  /* El panel que está más cerca de su sitio (al final del todo, el último) */
  function nearest(x) {
    if (x >= max - 2) return n - 1;
    let best = 0;
    starts.forEach((s, k) => { if (Math.abs(s - x) < Math.abs(starts[best] - x)) best = k; });
    return best;
  }

  function setDisabled(btn, off) {
    if (btn) btn.setAttribute("aria-disabled", String(off));   // aria-disabled: el foco no se pierde al llegar al final
  }

  function update() {
    ticking = false;
    if (!starts.length) measure();
    const x = track.scrollLeft;
    const i = nearest(x);
    if (i !== active) { active = i; count.textContent = pad2(i + 1); }
    const p = max > 0 ? x / max : 0;
    bar.style.transform = `scaleX(${(1 / n + p * (1 - 1 / n)).toFixed(4)})`;
    setDisabled(prev, x <= 2);
    setDisabled(next, x >= max - 2);
    if (target != null && Math.abs(x - starts[target]) < 2) arrived();
    if (reduce) return;
    panels.forEach((el, k) => {
      const t = clamp((starts[k] - x) / step, -1.5, 1.5);
      if (Math.abs(t - lastT[k]) < 0.0005) return;
      lastT[k] = t;
      el.style.setProperty("--t", t.toFixed(4));
    });
  }

  /* Un salto (flechas o al soltar un arrastre) termina cuando el carrusel llega a su panel;
     si algo lo interrumpe (el trackpad, otro arrastre), a los ARRIVE ms como mucho */
  let arriveTimer = 0;
  const waiting = [];
  function arrived() {
    clearTimeout(arriveTimer);
    target = null;
    waiting.splice(0).forEach((fn) => fn());
  }
  function afterArrive(fn) { waiting.push(fn); }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  function goTo(i) {
    target = clamp(i, 0, n - 1);
    track.scrollTo({ left: starts[target], behavior });
    clearTimeout(arriveTimer);
    arriveTimer = setTimeout(arrived, ARRIVE);
    requestAnimationFrame(update);   // por si ya estaba ahí (no habrá evento de scroll)
  }
  // Varios clics seguidos avanzan varios paneles aunque el anterior aún no haya llegado
  const from = () => (target != null ? target : active);

  /* Flechas: botones y teclado (con el carrusel enfocado) */
  prev.addEventListener("click", () => { if (prev.getAttribute("aria-disabled") !== "true") goTo(from() - 1); });
  next.addEventListener("click", () => { if (next.getAttribute("aria-disabled") !== "true") goTo(from() + 1); });
  track.addEventListener("keydown", (e) => {
    if (e.target !== track || e.altKey || e.ctrlKey || e.metaKey) return;
    const to = { ArrowRight: from() + 1, ArrowLeft: from() - 1, Home: 0, End: n - 1 }[e.key];
    if (to == null) return;
    e.preventDefault();
    goTo(to);
  });

  /* Arrastrar con el ratón (con el dedo manda el scroll nativo) */
  let drag = null, moved = false;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: track.scrollLeft, from: active, v: 0, lx: e.clientX, lt: e.timeStamp };
    moved = false;
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    if (!(e.buttons & 1)) return release(e);   // se soltó fuera de la ventana
    const dx = e.clientX - drag.x;
    if (!moved) {
      if (Math.abs(dx) < DRAG_MIN) return;
      moved = true;
      // Si se agarró a mitad de un salto, se sigue desde donde está y hacia donde iba (sin volver atrás)
      drag.left = track.scrollLeft + dx;
      if (target != null) drag.from = target;
      target = null;
      track.classList.add("is-dragging");   // sin encaje mientras se arrastra
    }
    track.scrollLeft = drag.left - dx;
    const dt = e.timeStamp - drag.lt;
    if (dt > 0) drag.v = 0.8 * ((e.clientX - drag.lx) / dt) + 0.2 * drag.v;   // px/ms, suavizada
    drag.lx = e.clientX;
    drag.lt = e.timeStamp;
  });
  function release(e) {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (!moved) return;
    setTimeout(() => { moved = false; });   // el clic de este arrastre llega antes; los siguientes valen
    const v = e.timeStamp - d.lt > 90 ? 0 : clamp(d.v, -4, 4);   // soltar tras pararse no lanza
    const x = track.scrollLeft;
    const here = nearest(x);
    // La inercia lleva como mucho un panel más allá de donde se soltó
    let k = clamp(nearest(clamp(x - v * FLING, 0, max)), here - 1, here + 1);
    // Un arrastre corto pero claro ya pasa de panel
    if (k === d.from && Math.abs(x - d.left) > step * FLICK) k = d.from + Math.sign(x - d.left);
    goTo(k);
    // El encaje vuelve cuando el panel ha llegado (si no, saltaría antes de tiempo)
    // (si al llegar el botón está pulsado pero sin arrastrar, también: si luego arrastra, se vuelve a poner)
    afterArrive(() => { if (!drag || !moved) track.classList.remove("is-dragging"); });
  }
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  // Un arrastre no es un clic: no abre la web del panel
  track.addEventListener("click", (e) => {
    if (!moved) return;
    e.preventDefault();
    e.stopPropagation();
  }, true);
  track.addEventListener("dragstart", (e) => e.preventDefault());

  function layout() { measure(); update(); }
  track.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", layout);

  /* Cuando el carrusel se acerca a la pantalla: la primera medida (así no se calcula nada al cargar
     la página) y todas las capturas, que son lazy y, al estar fuera de pantalla en horizontal,
     no se pedirían hasta llegar a ellas */
  if (!("IntersectionObserver" in window)) { layout(); return; }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((en) => en.isIntersecting)) return;
    io.disconnect();
    layout();
    track.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = "eager"; });
  }, { rootMargin: "600px 0px" });
  io.observe(track);
}
