/* =========================================================
   Contacto: clic en el email = se copia y aparece un aviso.
   Si el portapapeles no está disponible, se abre el correo.
   "Escríbenos" siempre es un mailto.
   ========================================================= */
export function initContact(email) {
  const toastEl = document.querySelector(".toast");
  const t = (k) => (window.SyncroI18n ? window.SyncroI18n.t(k) : "");
  let timer;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(timer);
    timer = setTimeout(() => toastEl.classList.remove("is-on"), 2200);
  };
  document.querySelectorAll("[data-copy-mail]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);
        toast(t("contact.copied") || "Email copiado");
      } catch (e) {
        window.location.href = "mailto:" + email;
      }
    });
  });
}
