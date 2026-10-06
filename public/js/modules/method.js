/* =========================================================
   04 · Método (oscuro): lista que se ilumina
   Escritorio con ratón: la sección se queda fija mientras bajas y se ilumina un paso
   cada vez (su plazo y su texto aparecen a la derecha); la línea de la izquierda se llena.
   Móvil / táctil: los pasos van uno debajo de otro y se ilumina el que pasa por el centro.
   Movimiento reducido o sin JavaScript: todos los pasos encendidos y sin fijar.
   El cambio de color y de texto lo hace el CSS (.is-on); aquí solo se mide el scroll.
   ========================================================= */
import { MQ, reduce } from "./core.js";

export function initMethod() {
  const sec = document.getElementById("metodo");
  if (!sec || reduce) return;
  const pin = sec.querySelector(".method__pin");
  const list = sec.querySelector(".steps");
  const steps = Array.from(list.querySelectorAll(".step"));
  const desk = window.matchMedia(MQ.desktop);
  const clamp = (v) => Math.max(0, Math.min(1, v));
  let active = -1, ticking = false;

  list.classList.add("is-spy");
  function setActive(i) {
    if (i === active) return;
    active = i;
    steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
  }

  function update() {
    ticking = false;
    const vh = window.innerHeight;
    if (sec.classList.contains("is-pinned")) {
      // Fijado: el avance por el tramo fijo decide el paso (cuatro tramos iguales)
      const r = pin.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - vh));
      list.style.setProperty("--p", p.toFixed(4));
      setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    } else {
      // Sin fijar: el paso más cerca del centro de la pantalla
      const mid = vh * 0.5;
      let best = 0, bestD = Infinity;
      steps.forEach((s, k) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = k; }
      });
      const lr = list.getBoundingClientRect();
      list.style.setProperty("--p", clamp((mid - lr.top) / lr.height).toFixed(4));
      setActive(best);
    }
  }

  /* La palabra nunca invade el texto de la derecha ni se sale (por si en el panel se escribe una más larga) */
  function fit() {
    steps.forEach((s) => {
      const w = s.querySelector(".step__word"), info = s.querySelector(".step__info");
      w.style.fontSize = "";
      const limit = (sec.classList.contains("is-pinned") ? info.offsetLeft - 32 : s.clientWidth) - w.offsetLeft;
      if (limit > 0 && w.scrollWidth > limit) w.style.fontSize = (parseFloat(getComputedStyle(w).fontSize) * limit) / w.scrollWidth + "px";
    });
  }

  function layout() {
    sec.classList.toggle("is-pinned", desk.matches);
    fit();
    update();
  }

  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", layout);
  if (desk.addEventListener) desk.addEventListener("change", layout);
  document.addEventListener("syncro:lang", () => requestAnimationFrame(layout));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  layout();
}
