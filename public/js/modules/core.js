/* =========================================================
   Núcleo de movimiento: GSAP + ScrollTrigger + SplitText + Lenis
   - Lenis solo si no hay movimiento reducido
   - Anclas internas con desplazamiento suave y foco accesible
   - Registro de SplitText para rehacer los cortes al cambiar de idioma
   ========================================================= */
const { gsap, ScrollTrigger, SplitText } = window;

export const root = document.documentElement;
export const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Condiciones para gsap.matchMedia(): las secciones fijadas solo en escritorio con ratón */
export const MQ = {
  desktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
};

export let lenis = null;

/* Colores de la paleta (los escribe el build en :root desde el panel): "#RRGGBB" */
export const cssColor = (name) => getComputedStyle(root).getPropertyValue("--" + name).trim();
/* "#RRGGBB" → "r,g,b" para montar rgba() con opacidad */
export const rgbOf = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",");

export function initCore() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    root.classList.add("has-lenis");
  }

  document.addEventListener("click", onAnchorClick);
  // Asa para depurar desde la consola (y para las capturas de QA)
  window.__syncro = { get lenis() { return lenis; } };
}

/* ---------- Desplazamiento ---------- */
export function navHeight() {
  const nav = document.getElementById("nav");
  return nav ? nav.offsetHeight : 72;
}

export function scrollToTarget(el, { immediate = false } = {}) {
  if (!el) return;
  const offset = el.id === "top" ? 0 : -navHeight() + 1;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: immediate ? 0 : 1.4, immediate, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: reduce || immediate ? "auto" : "smooth" });
  }
}

export function scrollToY(y, { immediate = false } = {}) {
  if (lenis) lenis.scrollTo(y, { duration: immediate ? 0 : 1, immediate });
  else window.scrollTo({ top: y, behavior: reduce || immediate ? "auto" : "smooth" });
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

/* Bloquear / liberar el scroll (menú móvil, apertura) */
export function lockScroll(on) {
  if (lenis) on ? lenis.stop() : lenis.start();
  root.style.overflow = on ? "hidden" : "";
}

/* ---------- SplitText × idiomas ----------
   setLang() reescribe textContent/innerHTML y rompería los cortes:
   antes de cambiar se deshacen y después se vuelven a cortar. */
const splits = new Set();
/* Devuelve una función para darlo de baja (en la limpieza de gsap.matchMedia) */
export function registerSplit(split) { splits.add(split); return () => splits.delete(split); }
document.addEventListener("syncro:lang-before", () => splits.forEach((s) => s.revert()));
document.addEventListener("syncro:lang", () => {
  splits.forEach((s) => s.split());
  requestAnimationFrame(() => ScrollTrigger.refresh());
});

/* Texto que llena el ancho de su contenedor sin desbordarlo */
export function fitText(el, { max = 400, min = 16, ratio = 1 } = {}) {
  if (!el || !el.parentElement) return;
  el.style.fontSize = "100px";
  el.style.whiteSpace = "nowrap";
  const w = el.scrollWidth;
  const ps = getComputedStyle(el.parentElement);
  const avail = (el.parentElement.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight)) * ratio;
  el.style.fontSize = Math.max(min, Math.min(max, (100 * avail) / Math.max(1, w))) + "px";
}

/* Elementos a los que se entra una sola vez: si al rehacer (idioma) ya se habían visto, no se repiten */
const seen = new WeakSet();
export function markSeen(el) { seen.add(el); }
export function wasSeen(el) { return seen.has(el); }

/* Titular que entra línea a línea desde su máscara (una sola vez).
   Se rehace solo al cambiar de idioma o de ancho; devuelve la limpieza. */
export function revealLines(el, { start = "top 86%", stagger = 0.08, duration = 1.25, delay = 0 } = {}) {
  if (!el) return () => {};
  const split = SplitText.create(el, {
    type: "lines", mask: "lines", autoSplit: true, aria: "none",
    onSplit(self) {
      if (wasSeen(el)) return;
      return gsap.from(self.lines, {
        yPercent: 105, duration, stagger, delay, ease: "expo.out",
        scrollTrigger: { trigger: el, start, once: true, onEnter: () => markSeen(el) },
      });
    },
  });
  const unregister = registerSplit(split);
  return () => { unregister(); split.revert(); };
}
