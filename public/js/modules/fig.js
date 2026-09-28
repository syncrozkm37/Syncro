/* =========================================================
   Fig. 01 · "Marca y web, en sincronía"
   Las dos mitades del isotipo (el trazo del manual recortado, sin redibujar)
   entran desfasadas desde lados opuestos y encajan; se enciende el resplandor
   violeta y sube la frase.
   Escritorio: la escena se queda fija y todo va atado al scroll; después el
   acto claro (Estudio) sube por encima.
   Móvil / táctil: la misma coreografía se reproduce una vez al entrar.
   Movimiento reducido: estado final, sin animación.
   ========================================================= */
import { MQ } from "./core.js";

const { gsap } = window;

export function initFig() {
  const fig = document.getElementById("fig");
  if (!fig) return;
  const track = fig.querySelector(".fig__track");
  const a = fig.querySelector(".fig__half--a");
  const b = fig.querySelector(".fig__half--b");
  const glow = fig.querySelector(".fig__glow");
  const lines = fig.querySelectorAll(".fig__claim .ln > span");
  const cap = fig.querySelector(".fig__cap");

  const build = (tl) => {
    const far = () => Math.min(window.innerWidth * 0.36, 540);
    const up = () => window.innerHeight * 0.12;
    gsap.set(lines, { yPercent: 105 });             // las dos líneas empiezan escondidas (con stagger, fromTo solo ocultaba la primera)
    return tl
      .fromTo(a, { x: () => -far(), y: () => -up(), rotate: -32, opacity: 0 }, { x: 0, y: 0, rotate: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0)
      .fromTo(b, { x: () => far(), y: () => up(), rotate: -32, opacity: 0 }, { x: 0, y: 0, rotate: 0, opacity: 1, duration: 1, ease: "expo.out" }, 0)
      .fromTo(glow, { opacity: 0, scale: 0.35 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }, 0.72)
      .to(lines, { yPercent: 0, duration: 0.9, stagger: 0.1, ease: "expo.out" }, 0.95)
      .fromTo(cap, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.1);
  };

  const mm = gsap.matchMedia();

  mm.add(MQ.desktop, () => {
    fig.classList.add("is-pinned");
    build(gsap.timeline({
      scrollTrigger: { trigger: track, start: "top 65%", end: () => "+=" + window.innerHeight * 1.45, scrub: 0.8, invalidateOnRefresh: true },
    }));
    return () => fig.classList.remove("is-pinned");
  });

  mm.add(`not all and ${MQ.desktop}`, () => {
    if (window.matchMedia(MQ.reduce).matches) return;
    build(gsap.timeline({ scrollTrigger: { trigger: fig, start: "top 70%", once: true } }));
  });
}
