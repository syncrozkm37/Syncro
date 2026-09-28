/* =========================================================
   Cursor propio (solo ratón y sin movimiento reducido)
   Estados: punto · enlace · "Arrastra" · "Ver web ↗"
   Color según el acto: violeta sobre claro, violeta suave sobre oscuro, glacial sobre violeta.
   Botones magnéticos: [data-magnetic]
   ========================================================= */
import { finePointer, reduce, root } from "./core.js";

const { gsap } = window;

export function initCursor() {
  if (!finePointer || reduce) return;
  const cur = document.getElementById("cursor");
  if (!cur) return;
  root.classList.add("has-cursor");

  const xTo = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" });
  const yTo = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
  let visible = false;

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    if (!visible) { gsap.set(cur, { x: e.clientX, y: e.clientY }); cur.classList.add("is-on"); visible = true; }
    xTo(e.clientX); yTo(e.clientY);
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { cur.classList.remove("is-on"); visible = false; });

  document.addEventListener("pointerover", (e) => {
    const t = e.target;
    if (!t.closest) return;
    const view = t.closest('[data-cursor="view"]');
    const drag = !view && t.closest('[data-cursor="drag"]');
    cur.classList.toggle("is-view", !!view);
    cur.classList.toggle("is-drag", !!drag);
    cur.classList.toggle("is-link", !view && !drag && !!t.closest('a, button, [role="button"], summary, label'));
    const themed = t.closest("[data-cursor-theme], [data-theme]");
    const theme = themed ? (themed.dataset.cursorTheme || themed.dataset.theme) : "light";
    cur.classList.toggle("on-dark", theme === "dark");
    cur.classList.toggle("on-violet", theme === "violet");
  });

  /* Botones magnéticos: siguen un poco al puntero y vuelven al salir */
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - (r.left + r.width / 2)) * 0.28);
      my((e.clientY - (r.top + r.height / 2)) * 0.36);
    });
    el.addEventListener("pointerleave", () => { mx(0); my(0); });
  });
}
