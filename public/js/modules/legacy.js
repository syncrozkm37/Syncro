/* =========================================================
   LEGADO — comportamiento de las secciones aún sin rediseñar
   (revelado al entrar).
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

}
