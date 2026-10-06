/* =========================================================
   05 · Planes (claro, la pantalla tranquila)
   Sin cifras. Lo que incluye cada plan va en un desplegable:
   el botón cambia aria-expanded y el CSS abre o cierra la lista.
   Sin JavaScript, las listas se ven abiertas.
   ========================================================= */
export function initPrices() {
  document.querySelectorAll("#planes .plan__more").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", String(btn.getAttribute("aria-expanded") !== "true"));
    });
  });
}
