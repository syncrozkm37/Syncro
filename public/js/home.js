/* =========================================================
   Syncro — home: punto de entrada (módulo ES)
   Lenis llega antes con <script defer>. Sin más librerías.
   ========================================================= */
import { initCore } from "./modules/core.js";
import { initNav } from "./modules/nav.js";
import { initReveal } from "./modules/reveal.js";
import { initContact } from "./modules/contact.js";

const CONTACT_EMAIL = "syncrozkm37@gmail.com"; // buzón compartido del estudio; cambiar al dominio propio cuando lo haya

function boot() {
  initCore();
  // Cada pieza arranca por separado: si una falla, el resto de la web sigue funcionando
  const run = (name, fn) => { try { fn(); } catch (e) { console.error("[syncro] " + name, e); } };
  run("nav", initNav);
  run("apariciones", initReveal);
  run("contacto", () => initContact(CONTACT_EMAIL));

  /* Email de contacto centralizado */
  document.querySelectorAll(".js-mail").forEach((a) => { a.href = "mailto:" + CONTACT_EMAIL; });
  document.querySelectorAll(".js-mail-text").forEach((el) => { el.textContent = CONTACT_EMAIL; });
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  window.__syncroReady = true;
}

boot();
