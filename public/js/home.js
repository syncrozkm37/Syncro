/* =========================================================
   Syncro — home: punto de entrada (módulo ES)
   GSAP, ScrollTrigger, SplitText y Lenis llegan antes con <script defer>.
   ========================================================= */
import { initCore } from "./modules/core.js";
import { initNav } from "./modules/nav.js";
import { initCursor } from "./modules/cursor.js";
import { initHero } from "./modules/hero.js";
import { initFig } from "./modules/fig.js";
import { initStudio } from "./modules/studio.js";
import { initServices } from "./modules/services.js";
import { initLegacy } from "./modules/legacy.js";

const CONTACT_EMAIL = "syncrozkm37@gmail.com"; // buzón compartido del estudio; cambiar al dominio propio cuando lo haya

function boot() {
  if (!window.gsap || !window.ScrollTrigger) {
    // Sin librerías: la web se ve entera, sin animaciones
    document.documentElement.classList.remove("js", "is-opening", "hero-pre");
    return;
  }
  initCore();
  initNav();
  initCursor();
  initHero();
  initFig();
  initStudio();
  initServices();
  initLegacy();

  /* Email de contacto centralizado */
  document.querySelectorAll(".js-mail").forEach((a) => {
    a.href = "mailto:" + CONTACT_EMAIL;
    if (!a.classList.contains("btn") && !a.hasAttribute("data-keep-text")) a.textContent = CONTACT_EMAIL;
  });
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  window.__syncroReady = true;
  window.addEventListener("load", () => window.ScrollTrigger.refresh());
}

boot();
