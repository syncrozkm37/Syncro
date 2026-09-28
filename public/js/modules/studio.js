/* =========================================================
   01 · Estudio (acto claro)
   - Manifiesto que se ilumina palabra a palabra con el scroll (la frase clave, en violeta)
   - Misión y visión, a la vista y en grande: entran línea a línea
   - Equipo, compacto: las tres fichas suben al entrar
   ========================================================= */
import { MQ, registerSplit, revealLines } from "./core.js";

const { gsap, SplitText } = window;
// Estado "apagado" con contraste >= 3:1 (texto grande): legible aunque no se haya hecho scroll
const INK = "#1C1C1C", VIOLET = "#4915ED", DIM = "#7E8199", DIM_HL = "#8373E0";

export function initStudio() {
  const sec = document.getElementById("estudio");
  if (!sec) return;
  const text = sec.querySelector(".studio__text");

  const mm = gsap.matchMedia();

  mm.add(MQ.motion, () => {
    // Manifiesto: de apagado a encendido, palabra a palabra, atado al scroll
    const split = SplitText.create(text, {
      type: "words", aria: "none",
      onSplit(self) {
        return gsap.fromTo(self.words,
          { color: (i, el) => (el.closest(".hl") ? DIM_HL : DIM) },
          {
            color: (i, el) => (el.closest(".hl") ? VIOLET : INK),
            ease: "none", stagger: 0.08,
            scrollTrigger: { trigger: text, start: "top 78%", end: "bottom 42%", scrub: true },
          });
      },
    });
    const unregister = registerSplit(split);

    // Misión y visión: línea a línea (la segunda, un poco después)
    const undoMv = Array.from(sec.querySelectorAll(".mv__text"), (el, i) => revealLines(el, { start: "top 88%", delay: i * 0.12 }));

    // Equipo: las fichas suben
    gsap.from(sec.querySelectorAll(".team__member"), {
      y: 36, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out",
      scrollTrigger: { trigger: sec.querySelector(".team"), start: "top 88%", once: true },
    });

    return () => { unregister(); split.revert(); undoMv.forEach((f) => f()); };
  });
}
