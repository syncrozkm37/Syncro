/* =========================================================
   Fig. 01 · "Marca y web, en sincronía"
   Escritorio: la escena se queda fija (sticky); un panel pequeño crece hasta
   pantalla completa y las dos mitades de la frase entran por lados opuestos
   y encajan. Después, el acto claro (Estudio) sube por encima.
   Móvil / táctil: el panel se revela al entrar, sin fijar.
   ========================================================= */
import { MQ } from "./core.js";

const { gsap } = window;

export function initFig() {
  const fig = document.getElementById("fig");
  if (!fig) return;
  const track = fig.querySelector(".fig__track");
  const panel = fig.querySelector(".fig__panel");
  const bg = fig.querySelector(".fig__bg");
  const a = fig.querySelector(".fig__a");
  const b = fig.querySelector(".fig__b");
  const iso = fig.querySelector(".fig__iso");
  const cap = fig.querySelector(".fig__cap");

  const mm = gsap.matchMedia();

  mm.add(MQ.desktop, () => {
    fig.classList.add("is-pinned");
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: track, start: "top top", end: () => "+=" + window.innerHeight, scrub: true, invalidateOnRefresh: true },
    });
    tl.fromTo(panel, { clipPath: "inset(24% 31% 24% 31% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, 0)
      .fromTo(bg, { scale: 1.4 }, { scale: 1 }, 0)
      .fromTo(a, { xPercent: -55, opacity: 0.2 }, { xPercent: 0, opacity: 1, ease: "power2.out" }, 0.12)
      .fromTo(b, { xPercent: 55, opacity: 0.2 }, { xPercent: 0, opacity: 1, ease: "power2.out" }, 0.12)
      .fromTo(iso, { rotate: -34, scale: 0.55, opacity: 0 }, { rotate: 0, scale: 1, opacity: 0.9, ease: "power2.out" }, 0.3)
      .fromTo(cap, { opacity: 0 }, { opacity: 1 }, 0.7);
    return () => fig.classList.remove("is-pinned");
  });

  mm.add(`not all and ${MQ.desktop}`, () => {
    // Sin fijar: revelado único al entrar (con movimiento reducido todo queda visible)
    if (window.matchMedia(MQ.reduce).matches) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: "top 75%", once: true } });
    tl.fromTo(panel, { clipPath: "inset(10% 8% 10% 8% round 22px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.4, ease: "expo.out" }, 0)
      .fromTo(a, { xPercent: -30, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.2 }, 0.2)
      .fromTo(b, { xPercent: 30, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.2 }, 0.2)
      .fromTo(iso, { rotate: -30, opacity: 0 }, { rotate: 0, opacity: 0.9, duration: 1.4 }, 0.3);
  });
}
