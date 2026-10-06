/* =========================================================
   Núcleo: scroll suave (Lenis) y anclas internas con foco accesible.
   Lenis solo si no hay movimiento reducido.
   ========================================================= */
export const root = document.documentElement;
export const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export let lenis = null;

export function initCore() {
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: true });
    root.classList.add("has-lenis");
  }
  document.addEventListener("click", onAnchorClick);
  // Asa para depurar desde la consola (y para las capturas de QA)
  window.__syncro = { get lenis() { return lenis; } };
}

export function navHeight() {
  const nav = document.getElementById("nav");
  return nav ? nav.offsetHeight : 72;
}

export function scrollToTarget(el) {
  if (!el) return;
  const offset = el.id === "top" ? 0 : -navHeight() + 1;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
}

function onAnchorClick(e) {
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
  const hash = a.getAttribute("href");
  if (hash.length < 2) return;
  const el = document.getElementById(hash.slice(1));
  if (!el) return;
  e.preventDefault();
  scrollToTarget(el);
  history.replaceState(null, "", hash);
  // Foco en el destino para lectores de pantalla y teclado (sin saltar el scroll)
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

/* Bloquear / liberar el scroll (menú móvil) */
export function lockScroll(on) {
  if (lenis) on ? lenis.stop() : lenis.start();
  root.style.overflow = on ? "hidden" : "";
}
