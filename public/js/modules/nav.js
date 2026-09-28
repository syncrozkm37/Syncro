/* =========================================================
   Navegación: tema claro/oscuro según el acto, ocultar al bajar,
   píldora con indicador de sección (scroll-spy), menú móvil
   y letras que ruedan al pasar el ratón.
   ========================================================= */
import { lockScroll } from "./core.js";

const { gsap } = window;

/* Parte el texto de un enlace en letras duplicadas (el lector de pantalla lee el .sr-only) */
function esc(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
export function rollify(el) {
  const text = el.textContent.trim();
  const chars = Array.from(text).map((c, i) => {
    const v = c === " " ? " " : c;
    return `<span class="roll__c" style="--i:${i}" data-c="${esc(v)}">${esc(v)}</span>`;
  }).join("");
  el.innerHTML = `<span class="sr-only">${esc(text)}</span><span class="roll" aria-hidden="true">${chars}</span>`;
}

export function initNav() {
  const nav = document.getElementById("nav");
  const pill = nav.querySelector(".nav__pill");
  const ind = pill.querySelector(".nav__ind");
  const links = Array.from(pill.querySelectorAll('a[href^="#"]'));
  const targets = links.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
  const rollLinks = () => document.querySelectorAll(".nav__pill a, [data-roll]");

  rollLinks().forEach(rollify);
  document.addEventListener("syncro:lang", () => { rollLinks().forEach(rollify); active = -2; });

  let lastY = window.scrollY, ticking = false, active = -2;

  function themeAt(y) {
    // Elemento más alto bajo la línea central de la barra (ignorando la propia barra y el cursor)
    const stack = document.elementsFromPoint(window.innerWidth / 2, y);
    for (const el of stack) {
      if (nav.contains(el) || el.closest(".cursor, .mobile-menu, .opening")) continue;
      const t = el.closest("[data-theme]");
      return t ? t.dataset.theme : "light";
    }
    return "light";
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    links.forEach((a, k) => a.setAttribute("aria-current", String(k === i)));
    if (i < 0) { ind.classList.remove("is-on"); return; }
    const a = links[i];
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
    if (!ind.classList.contains("is-on")) {
      ind.style.transition = "none"; void ind.offsetWidth; ind.style.transition = "";
      ind.classList.add("is-on");
    }
  }

  function update() {
    const y = window.scrollY;
    if (!document.body.classList.contains("menu-open")) {
      if (y > lastY + 4 && y > 480) nav.classList.add("is-hidden");
      else if (y < lastY - 4 || y < 480) nav.classList.remove("is-hidden");
    }
    const theme = themeAt(nav.offsetHeight / 2);
    nav.classList.toggle("is-dark", theme === "dark");

    // Sección activa: la última cuyo borde superior ha pasado el 45 % de la pantalla
    const line = window.innerHeight * 0.45;
    let idx = -1;
    targets.forEach((t, k) => { if (t && t.getBoundingClientRect().top <= line) idx = k; });
    const contact = document.getElementById("contacto");
    if (contact && contact.getBoundingClientRect().top <= line) idx = -1;
    setActive(idx);

    lastY = y; ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  window.addEventListener("resize", () => { active = -2; update(); });
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
    if (open) {
      nav.classList.remove("is-hidden");
      gsap.fromTo(menu.querySelectorAll("li, .mobile-menu__foot"), { yPercent: 40, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, stagger: 0.05, delay: 0.25, ease: "expo.out" });
      const first = menu.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    }
  }
  burger.addEventListener("click", () => toggleMenu(!document.body.classList.contains("menu-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) { toggleMenu(false); burger.focus(); }
  });
}
