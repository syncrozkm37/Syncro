/* =========================================================
   Núcleo: scroll suave (Lenis) sincronizado con GSAP/ScrollTrigger,
   y anclas internas con foco accesible.
   Lenis solo si no hay movimiento reducido. GSAP solo lo usa Método.
   ========================================================= */
export const root = document.documentElement;
export const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Condiciones para gsap.matchMedia(): los actos fijados de Método, solo en escritorio con ratón */
export const MQ = {
  desktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
};

export let lenis = null;

export function initCore() {
  const { gsap, ScrollTrigger } = window;
  const withGsap = !!(gsap && ScrollTrigger);
  if (withGsap) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
  if (!reduce && window.Lenis) {
    // Con GSAP, un solo reloj: el de GSAP mueve Lenis y ScrollTrigger se entera de cada paso
    lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: !withGsap });
    if (withGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
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
    // Lenis ya descuenta el scroll-padding-top del <html> (la altura de la barra): se devuelve para no restarla dos veces
    const pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    lenis.scrollTo(el, { offset: offset + pad, duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
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
