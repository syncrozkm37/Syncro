/* =========================================================
   Navegación: tema claro/oscuro según la sección que hay debajo,
   velo al bajar, indicador de sección en la píldora y menú móvil.
   ========================================================= */
import { lockScroll } from "./core.js";

export function initNav() {
  const nav = document.getElementById("nav");
  const pill = nav.querySelector(".nav__pill");
  const ind = pill.querySelector(".nav__ind");
  const links = Array.from(pill.querySelectorAll('a[href^="#"]'));
  const targets = links.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
  const contact = document.getElementById("contacto");
  let ticking = false, active = -2;

  /* Tema: el de la sección que queda bajo el centro de la barra */
  function themeAt(y) {
    for (const el of document.elementsFromPoint(window.innerWidth / 2, y)) {
      if (nav.contains(el) || el.closest(".mobile-menu")) continue;
      const t = el.closest("[data-theme]");
      return t ? t.dataset.theme : "light";
    }
    return "light";
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    links.forEach((a, k) => (k === i ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    if (i < 0) { ind.classList.remove("is-on"); return; }
    const a = links[i];
    if (!ind.classList.contains("is-on")) { ind.style.transition = "none"; }
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = `translateX(${a.offsetLeft - 4}px)`;
    void ind.offsetWidth;
    ind.style.transition = "";
    ind.classList.add("is-on");
  }

  function update() {
    nav.classList.toggle("is-dark", themeAt(nav.offsetHeight / 2) === "dark");
    nav.classList.toggle("is-solid", window.scrollY > 40);
    // Sección activa: la última cuyo borde superior ha pasado el 45 % de la pantalla (ninguna en la portada y en Contacto)
    const line = window.innerHeight * 0.45;
    let idx = -1;
    targets.forEach((t, k) => { if (t && t.getBoundingClientRect().top <= line) idx = k; });
    if (contact && contact.getBoundingClientRect().top <= line) idx = -1;
    setActive(idx);
    ticking = false;
  }
  const onScroll = () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { active = -2; update(); });
  document.addEventListener("syncro:lang", () => { active = -2; update(); });   // el ancho de los enlaces cambia con el idioma
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { active = -2; update(); });
  update();

  /* ---------- Menú móvil ---------- */
  const burger = nav.querySelector(".burger");
  const menu = document.getElementById("mobile-menu");
  function toggleMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;
    lockScroll(open);
    if (open) { const first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true }); }
  }
  burger.addEventListener("click", () => toggleMenu(!document.body.classList.contains("menu-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) { toggleMenu(false); burger.focus(); }
  });
}
