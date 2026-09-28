/* =========================================================
   04 · Método (acto oscuro)
   Escritorio: cuatro actos a pantalla completa, fijados. Cada uno tiene
   una palabra gigante, una línea y un visual hecho con elementos de marca:
     1 Escuchar  → ondas que se abren desde un punto violeta
     2 Definir   → 48 isotipos desordenados que encajan en la retícula (sincronía)
     3 Construir → una maqueta de bloques que se convierte en la web real de Kaia
     4 Lanzar    → un haz violeta que sube
   Móvil / táctil: los actos van uno debajo de otro y se reproducen al entrar.
   Movimiento reducido: todo en su estado final, sin animación.
   ========================================================= */
import { MQ, revealLines } from "./core.js";

const { gsap } = window;

/* Aleatorio con semilla: el desorden inicial es siempre el mismo */
function seeded(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

/* Cada visual devuelve una línea de tiempo de duración 1 (se encaja en el tramo de su acto) */
function visualTimeline(act, n) {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  if (n === 1) {
    const rings = act.querySelectorAll(".v-rings circle:not(.v-dot)");
    tl.fromTo(rings, { scale: 0.35, opacity: 0, transformOrigin: "50% 50%" },
      { scale: 1, opacity: (i) => 0.9 - i * 0.1, duration: 0.8, stagger: 0.03 }, 0)
      .fromTo(act.querySelector(".v-dot"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3 }, 0);
  } else if (n === 2) {
    const rnd = seeded(7);
    const marks = act.querySelectorAll(".v-grid use");
    tl.fromTo(marks,
      { x: () => (rnd() - 0.5) * 520, y: () => (rnd() - 0.5) * 380, rotation: () => (rnd() - 0.5) * 220, opacity: 0.35, transformOrigin: "50% 50%" },
      { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.85, stagger: { each: 0.004, from: "random" }, ease: "power3.inOut" }, 0);
  } else if (n === 3) {
    const rnd = seeded(3);
    tl.fromTo(act.querySelectorAll(".v-build .b"),
      { xPercent: () => (rnd() - 0.5) * 140, yPercent: () => (rnd() - 0.5) * 260, opacity: 0 },
      { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.04, ease: "power3.out" }, 0)
      .fromTo(act.querySelector(".v-build__shot"), { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.3 }, 0.7);
  } else if (n === 4) {
    tl.fromTo(act.querySelector(".v-launch__beam"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.8, ease: "power3.inOut" }, 0)
      .fromTo(act.querySelector(".v-launch__glow"), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9 }, 0);
  }
  return tl;
}

export function initMethod() {
  const sec = document.getElementById("metodo");
  if (!sec) return;
  const pin = sec.querySelector(".method__pin");
  const acts = Array.from(sec.querySelectorAll(".act"));
  const dots = Array.from(sec.querySelectorAll(".acts__dots i"));

  const mm = gsap.matchMedia();

  mm.add(MQ.motion, () => {
    const undo1 = revealLines(sec.querySelector(".h2"));
    const undo2 = revealLines(sec.querySelector(".motto__q"), { start: "top 85%" });
    return () => { undo1(); undo2(); };
  });

  /* Escritorio: actos fijados y atados al scroll · Sin fijar (móvil / táctil): cada acto se reproduce al entrar */
  mm.add({ desktop: MQ.desktop, motion: MQ.motion }, (ctx) => {
    const { desktop, motion } = ctx.conditions;
    if (!motion) return;

    if (!desktop) {
      acts.forEach((act, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: act, start: "top 72%", once: true } });
        tl.from(act.querySelector(".act__word"), { yPercent: 105, duration: 1.1, ease: "expo.out" }, 0)
          .from(act.querySelectorAll(".act__time, .act__line"), { y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.1)
          .add(visualTimeline(act, i + 1).duration(1.6), 0);
      });
      return;
    }

    sec.classList.add("is-pinned");
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: pin, start: "top top", end: "bottom bottom", scrub: 0.6,
        onUpdate: (self) => {
          const i = Math.min(acts.length - 1, Math.floor(self.progress * acts.length));
          dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
        },
      },
    });
    acts.forEach((act, i) => {
      const n = i + 1;
      const word = act.querySelector(".act__word");
      const bits = act.querySelectorAll(".act__time, .act__line");
      if (i > 0) {
        tl.fromTo(act, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, i)
          .fromTo(word, { yPercent: 105 }, { yPercent: 0, duration: 0.45, ease: "power3.out" }, i)
          .fromTo(bits, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: "power3.out" }, i + 0.08);
      }
      if (i === 0) {
        // El primer visual se dibuja mientras la escena llega, para no empezar con la pantalla vacía
        gsap.timeline({ scrollTrigger: { trigger: pin, start: "top 85%", end: "top top", scrub: 0.6 } }).add(visualTimeline(act, n));
      } else {
        tl.add(visualTimeline(act, n), i + 0.05);
      }
      if (i < acts.length - 1) {
        tl.to(word, { yPercent: -105, duration: 0.4, ease: "power3.in" }, i + 0.78)
          .to(bits, { y: -20, opacity: 0, duration: 0.3 }, i + 0.78)
          .to(act, { autoAlpha: 0, duration: 0.2 }, i + 0.96);
      }
    });
    return () => { sec.classList.remove("is-pinned"); };
  });
}
