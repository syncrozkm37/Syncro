/* =========================================================
   Apariciones suaves: los bloques con [data-reveal] suben y aparecen
   una sola vez al entrar en pantalla (el CSS hace la transición;
   style="--d:1" los escalona). Con movimiento reducido, todo visible.
   ========================================================= */
import { reduce } from "./core.js";

export function initReveal() {
  const els = Array.from(document.querySelectorAll("[data-reveal]"));
  if (reduce || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      io.unobserve(en.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  els.forEach((el) => io.observe(el));
}
