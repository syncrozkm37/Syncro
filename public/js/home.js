/* =========================================================
   Syncro — home: punto de entrada (módulo ES)
   GSAP + ScrollTrigger (los actos de Método) y Lenis llegan antes con <script defer>.
   ========================================================= */
import { initCore } from "./modules/core.js";
import { initNav } from "./modules/nav.js";
import { initHero } from "./modules/hero.js";
import { initReveal } from "./modules/reveal.js";
import { initMethod } from "./modules/method.js";
import { initPrices } from "./modules/prices.js";
import { initContact } from "./modules/contact.js";

const CONTACT_EMAIL = "syncrozkm37@gmail.com"; // buzón compartido del estudio; cambiar al dominio propio cuando lo haya

function boot() {
  initCore();
  // Cada pieza arranca por separado: si una falla, el resto de la web sigue funcionando
  const run = (name, fn) => { try { fn(); } catch (e) { console.error("[syncro] " + name, e); } };
  run("nav", initNav);
  run("portada", initHero);
  run("apariciones", initReveal);
  run("método", initMethod);
  run("planes", initPrices);
  run("contacto", () => initContact(CONTACT_EMAIL));

  /* Email de contacto centralizado */
  document.querySelectorAll(".js-mail").forEach((a) => { a.href = "mailto:" + CONTACT_EMAIL; });
  document.querySelectorAll(".js-mail-text").forEach((el) => { el.textContent = CONTACT_EMAIL; });
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  window.__syncroReady = true;
}

boot();
