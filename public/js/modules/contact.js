/* =========================================================
   06 · Contacto (acto oscuro, el final)
   Resplandor violeta y un haz vertical. "¿Hablamos?" entra por la izquierda
   y el email por la derecha: encajan en el haz (último momento "en sincronía").
   Clic en el email: se copia y aparece un aviso; "Escríbenos" abre el correo.
   ========================================================= */
import { MQ, fitText } from "./core.js";

const { gsap } = window;

export function initContact(email) {
  const sec = document.getElementById("contacto");
  if (!sec) return;
  const stage = sec.querySelector(".contact__stage");
  const big = sec.querySelector(".contact__big");
  const toastEl = document.querySelector(".toast");
  const t = (k) => (window.SyncroI18n ? window.SyncroI18n.t(k) : "");

  /* "¿Hablamos?" llena su mitad (o el ancho entero en móvil) sin desbordar */
  const fit = () => fitText(big, { max: 210, min: 40 });
  fit();
  window.addEventListener("resize", fit);
  document.addEventListener("syncro:lang", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  /* Copiar el email con aviso; si el portapapeles no está disponible, se abre el correo */
  let timer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(timer);
    timer = setTimeout(() => toastEl.classList.remove("is-on"), 2200);
  };
  sec.querySelectorAll("[data-copy-mail]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        toast(t("contact.copied") || "Email copiado");
      } catch (e) {
        window.location.href = "mailto:" + email;
      }
    });
  });

  const mm = gsap.matchMedia();
  mm.add(MQ.motion, () => {
    const st = { trigger: stage, start: "top 88%", end: "top 18%", scrub: true };
    gsap.fromTo(sec.querySelector(".contact__a"), { xPercent: -22, opacity: 0.15 }, { xPercent: 0, opacity: 1, ease: "power2.out", scrollTrigger: st });
    gsap.fromTo(sec.querySelector(".contact__b"), { xPercent: 22, opacity: 0.15 }, { xPercent: 0, opacity: 1, ease: "power2.out", scrollTrigger: st });
    gsap.fromTo(sec.querySelector(".contact__beam"), { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, ease: "none", scrollTrigger: st });
    gsap.fromTo(sec.querySelector(".contact__glow"), { opacity: 0.2, scale: 0.8 }, { opacity: 1, scale: 1, ease: "none", scrollTrigger: { trigger: stage, start: "top 90%", end: "bottom bottom", scrub: true } });
  });
}
