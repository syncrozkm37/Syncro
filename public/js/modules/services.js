/* =========================================================
   02 · Servicios (acto claro)
   Índice sencillo: número, título y descripción a la vista, sin imágenes
   ni desplegables. El hover (franja · isotipo · título violeta) es solo CSS;
   aquí solo entran el titular y las filas.
   ========================================================= */
import { MQ, revealLines } from "./core.js";

const { gsap } = window;

export function initServices() {
  const sec = document.getElementById("servicios");
  if (!sec) return;

  const mm = gsap.matchMedia();

  mm.add(MQ.motion, () => {
    const undo = revealLines(sec.querySelector(".h2"));
    gsap.from(sec.querySelectorAll(".svc"), {
      y: 40, opacity: 0, duration: 1.1, stagger: 0.07, ease: "expo.out",
      scrollTrigger: { trigger: sec.querySelector(".svc-list"), start: "top 85%", once: true },
    });
    return undo;
  });
}
