/* =========================================================
   02 · Servicios (acto claro)
   Índice de filas gigantes con el ADN del hover original:
   franja de color · el isotipo entra · título violeta · la flecha gira.
   Escritorio: la fila se abre al pasar el ratón y una vista previa
   de trabajo real sigue al cursor. Táctil / teclado: acordeón.
   ========================================================= */
import { MQ, revealLines } from "./core.js";

const { gsap } = window;

export function initServices() {
  const sec = document.getElementById("servicios");
  if (!sec) return;
  const rows = Array.from(sec.querySelectorAll(".svc"));

  /* Acordeón accesible (clic, Enter, Espacio) */
  rows.forEach((row) => {
    const btn = row.querySelector(".svc__head");
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      row.classList.toggle("is-open", open);
    });
  });

  const mm = gsap.matchMedia();

  mm.add(MQ.motion, () => {
    const undo = revealLines(sec.querySelector(".h2"));
    gsap.from(rows, {
      y: 40, opacity: 0, duration: 1.1, stagger: 0.07, ease: "expo.out",
      scrollTrigger: { trigger: sec.querySelector(".svc-list"), start: "top 85%", once: true },
    });
    return undo;
  });

  /* Vista previa que sigue al cursor */
  mm.add(MQ.desktop, () => {
    const preview = sec.querySelector(".svc-preview");
    const card = preview.querySelector(".svc-preview__card");
    const items = Array.from(preview.querySelectorAll(".svc-preview__item"));
    const cap = preview.querySelector(".svc-preview__cap");
    const list = sec.querySelector(".svc-list");
    const xTo = gsap.quickTo(preview, "x", { duration: 0.7, ease: "power3" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.7, ease: "power3" });
    const rTo = gsap.quickTo(card, "rotate", { duration: 0.9, ease: "power3" });
    let lastX = 0, shown = false;
    gsap.set(card, { clipPath: "inset(50% 50% 50% 50% round 14px)" });

    const show = (key, text) => {
      items.forEach((it) => it.classList.toggle("is-on", it.dataset.key === key));
      cap.textContent = text || "";
      if (!key) return hide();
      if (!shown) { shown = true; gsap.to(card, { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 0.8, ease: "expo.out", overwrite: "auto" }); }
    };
    const hide = () => {
      if (!shown) return;
      shown = false;
      gsap.to(card, { clipPath: "inset(50% 50% 50% 50% round 14px)", duration: 0.6, ease: "expo.inOut", overwrite: "auto" });
    };
    const move = (e) => {
      xTo(e.clientX); yTo(e.clientY);
      rTo(Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.4)));
      lastX = e.clientX;
    };
    const enterRow = (e) => show(e.currentTarget.dataset.preview, e.currentTarget.querySelector(".svc__desc").textContent);
    rows.forEach((r) => r.addEventListener("pointerenter", enterRow));
    list.addEventListener("pointermove", move);
    list.addEventListener("pointerleave", hide);
    return () => {
      rows.forEach((r) => r.removeEventListener("pointerenter", enterRow));
      list.removeEventListener("pointermove", move);
      list.removeEventListener("pointerleave", hide);
    };
  });
}
