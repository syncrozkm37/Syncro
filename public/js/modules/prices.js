/* =========================================================
   05 · Precios (acto claro) — la pantalla tranquila
   Sin cifras. Lo que incluye cada plan va en un desplegable.
   Único movimiento: el titular y las tarjetas entran una vez.
   ========================================================= */
import { MQ, revealLines } from "./core.js";

const { gsap } = window;

export function initPrices() {
  const sec = document.getElementById("precios");
  if (!sec) return;

  sec.querySelectorAll(".plan__more").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", String(btn.getAttribute("aria-expanded") !== "true"));
    });
  });

  const mm = gsap.matchMedia();
  mm.add(MQ.motion, () => {
    const undo = revealLines(sec.querySelector(".h2"));
    gsap.from(sec.querySelectorAll(".prices__shared, .plan"), {
      y: 50, opacity: 0, duration: 1.2, stagger: 0.08, ease: "expo.out",
      scrollTrigger: { trigger: sec.querySelector(".plans"), start: "top 85%", once: true },
    });
    return undo;
  });
}
