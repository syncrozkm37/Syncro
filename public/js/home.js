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
import { initWork } from "./modules/work.js";
import { initMethod } from "./modules/method.js";
import { initPrices } from "./modules/prices.js";
import { initContact } from "./modules/contact.js";

const CONTACT_EMAIL = "syncrozkm37@gmail.com"; // buzón compartido del estudio; cambiar al dominio propio cuando lo haya

function boot() {
  if (!window.gsap || !window.ScrollTrigger) {
    // Sin librerías: la web se ve entera, sin animaciones
    document.documentElement.classList.remove("js", "is-opening", "hero-pre");
    return;
  }
  initCore();
  // Cada sección arranca por separado: si una falla, el resto de la web sigue funcionando
  const run = (name, fn) => { try { fn(); } catch (e) { console.error("[syncro] " + name, e); } };
  run("nav", initNav);
  run("cursor", initCursor);
  run("hero", initHero);
  run("fig", initFig);
  run("estudio", initStudio);
  run("servicios", initServices);
  run("proyectos", initWork);
  run("metodo", initMethod);
  run("precios", initPrices);
  run("contacto", () => initContact(CONTACT_EMAIL));

  /* Email de contacto centralizado */
  document.querySelectorAll(".js-mail").forEach((a) => { a.href = "mailto:" + CONTACT_EMAIL; });
  document.querySelectorAll(".js-mail-text").forEach((el) => { el.textContent = CONTACT_EMAIL; });
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  window.__syncroReady = true;
  window.addEventListener("load", () => window.ScrollTrigger.refresh());
}

boot();
