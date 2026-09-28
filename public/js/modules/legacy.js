/* =========================================================
   LEGADO — comportamiento de las secciones aún sin rediseñar
   (revelado al entrar y carrusel arrastrable de Proyectos).
   Se vacía sección a sección y se borra al terminar.
   ========================================================= */
import { reduce } from "./core.js";

const $ = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

export function initLegacy() {
  /* Revelado al entrar */
  const reveals = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* Carrusel arrastrable */
  const rail = $("#rail"), bar = $("#rail-progress"), prev = $("#rail-prev"), next = $("#rail-next");
  if (!rail) return;
  let down = false, moved = false, startX = 0, startScroll = 0;
  rail.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true; moved = false; startX = e.clientX; startScroll = rail.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 4) { moved = true; rail.classList.add("is-dragging"); }
    if (moved) rail.scrollLeft = startScroll - dx;
  });
  const stepSize = () => { const c = rail.querySelector(".card"); return c.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || 0); };
  window.addEventListener("pointerup", () => {
    if (!down) return; down = false;
    if (moved) {
      rail.classList.remove("is-dragging");
      rail.scrollTo({ left: Math.round(rail.scrollLeft / stepSize()) * stepSize(), behavior: reduce ? "auto" : "smooth" });
    }
  });
  rail.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  rail.addEventListener("dragstart", (e) => e.preventDefault());
  prev.addEventListener("click", () => rail.scrollBy({ left: -stepSize(), behavior: reduce ? "auto" : "smooth" }));
  next.addEventListener("click", () => rail.scrollBy({ left: stepSize(), behavior: reduce ? "auto" : "smooth" }));
  rail.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
  });
  function updateBar() {
    const max = rail.scrollWidth - rail.clientWidth;
    const ratio = rail.clientWidth / rail.scrollWidth;
    const p = max > 0 ? rail.scrollLeft / max : 0;
    bar.style.width = ratio * 100 + "%";
    bar.style.transform = "translateX(" + p * (1 / ratio - 1) * 100 + "%)";
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= max - 2;
  }
  rail.addEventListener("scroll", () => requestAnimationFrame(updateBar), { passive: true });
  window.addEventListener("resize", updateBar);
  updateBar();
}
