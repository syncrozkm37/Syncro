/* =========================================================
   01 · Estudio (acto claro)
   - Manifiesto que se ilumina palabra a palabra con el scroll (la frase clave, en violeta)
   - Objetos de barrio (recortes de Olmo y Kaia) a tres profundidades con parallax
   - Equipo: nombres gigantes que se inclinan hacia el puntero
   - Misión y Visión como desplegables accesibles
   ========================================================= */
import { MQ, registerSplit } from "./core.js";

const { gsap, SplitText } = window;
// Estado "apagado" con contraste >= 3:1 (texto grande): legible aunque no se haya hecho scroll
const INK = "#1C1C1C", VIOLET = "#4915ED", DIM = "#7E8199", DIM_HL = "#8373E0";

export function initStudio() {
  const sec = document.getElementById("estudio");
  if (!sec) return;
  const text = sec.querySelector(".studio__text");
  const manifesto = sec.querySelector(".studio__manifesto");

  /* Misión / Visión: desplegables (sin JS se ven abiertos) */
  sec.querySelectorAll(".mv__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", String(btn.getAttribute("aria-expanded") !== "true"));
    });
  });

  /* Nombres del equipo partidos en letras (no cambian con el idioma) */
  sec.querySelectorAll("[data-bend]").forEach((el) => {
    const name = el.textContent.trim();
    el.innerHTML = `<span class="sr-only">${name}</span><span class="team__chars" aria-hidden="true">${Array.from(name).map((c) => `<span class="ch">${c}</span>`).join("")}</span>`;
  });

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

    // Objetos: cada uno a su velocidad (profundidad)
    sec.querySelectorAll(".obj").forEach((o) => {
      const s = parseFloat(o.dataset.speed || 0.4);
      gsap.fromTo(o, { yPercent: 70 * s, rotate: -8 * s }, {
        yPercent: -90 * s, rotate: 8 * s, ease: "none",
        scrollTrigger: { trigger: manifesto, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Equipo: los nombres suben desde su máscara
    gsap.from(sec.querySelectorAll(".team__chars"), {
      yPercent: 110, duration: 1.3, stagger: 0.1, ease: "expo.out",
      scrollTrigger: { trigger: sec.querySelector(".team"), start: "top 80%", once: true },
    });

    return () => { unregister(); split.revert(); };
  });

  /* Letras que se inclinan hacia el puntero (solo ratón) */
  mm.add(MQ.desktop, () => {
    const rows = Array.from(sec.querySelectorAll(".team__row"));
    const cleanups = rows.map((row) => {
      const chars = Array.from(row.querySelectorAll(".ch"));
      const move = (e) => {
        chars.forEach((ch) => {
          const r = ch.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / 140;
          const w = Math.exp(-dx * dx);
          gsap.to(ch, { yPercent: -14 * w, rotate: -dx * 7 * w, duration: 0.6, ease: "power3.out", overwrite: "auto" });
        });
      };
      const leave = () => gsap.to(chars, { yPercent: 0, rotate: 0, duration: 0.9, ease: "power3.out", overwrite: "auto" });
      row.addEventListener("pointermove", move);
      row.addEventListener("pointerleave", leave);
      return () => { row.removeEventListener("pointermove", move); row.removeEventListener("pointerleave", leave); };
    });
    return () => cleanups.forEach((f) => f());
  });
}
