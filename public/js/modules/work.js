/* =========================================================
   03 · Proyectos (acto oscuro) — la pieza central
   Escritorio con ratón: la escena se queda fija y los seis paneles
   (cada uno en el color de su marca) pasan en horizontal con el scroll.
   Dentro de cada panel, navegador y móvil se mueven a distinta velocidad.
   Táctil, ventana estrecha o movimiento reducido: carrusel nativo con
   arrastre, flechas y teclado.
   ========================================================= */
import { MQ, reduce, revealLines, scrollToY } from "./core.js";

const { gsap, ScrollTrigger } = window;

export function initWork() {
  const sec = document.getElementById("proyectos");
  if (!sec) return;
  const pin = sec.querySelector(".work__pin");
  const track = sec.querySelector(".work__track");
  const panels = Array.from(track.querySelectorAll(".wp"));
  const count = sec.querySelector("#work-i");
  const bar = sec.querySelector("#work-bar");
  const prev = sec.querySelector("#work-prev");
  const next = sec.querySelector("#work-next");
  const setCount = (i) => { count.textContent = String(i + 1).padStart(2, "0"); };

  const mm = gsap.matchMedia();

  mm.add(MQ.motion, () => revealLines(sec.querySelector(".h2")));

  /* ---------- Escritorio: recorrido horizontal fijado ---------- */
  mm.add(MQ.desktop, () => {
    sec.classList.add("is-pinned");
    track.removeAttribute("data-cursor");          // aquí no se arrastra: se hace scroll
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const setHeight = () => { pin.style.height = dist() + window.innerHeight + "px"; };
    setHeight();
    ScrollTrigger.addEventListener("refreshInit", setHeight);

    const tween = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: pin, start: "top top", end: () => "+=" + dist(), scrub: true, invalidateOnRefresh: true,
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          setCount(Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1))));
        },
      },
    });

    // Parallax dentro de cada panel (atado al avance horizontal)
    panels.forEach((p) => {
      const st = { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true };
      const browser = p.querySelector(".wp__browser");
      const phone = p.querySelector(".wp__phone");
      const name = p.querySelector(".wp__name");
      const brand = p.querySelector(".wp__logo");
      if (browser) gsap.fromTo(browser, { xPercent: 16 }, { xPercent: -8, ease: "none", scrollTrigger: st });
      if (phone) gsap.fromTo(phone, { xPercent: 70, yPercent: 10 }, { xPercent: -40, yPercent: -8, ease: "none", scrollTrigger: st });
      if (name) gsap.fromTo(name, { xPercent: 14 }, { xPercent: -6, ease: "none", scrollTrigger: st });
      if (brand) gsap.fromTo(brand, { xPercent: 20, rotate: -6 }, { xPercent: -10, rotate: 4, ease: "none", scrollTrigger: st });
    });

    // Teclado: al enfocar un panel, el scroll lo trae al centro
    const onFocus = (e) => {
      const p = e.target.closest(".wp");
      if (!p) return;
      const x = Math.max(0, Math.min(dist(), p.offsetLeft - (window.innerWidth - p.offsetWidth) / 2));
      scrollToY(tween.scrollTrigger.start + x);
    };
    const step = (dir) => {
      const st = tween.scrollTrigger;
      const i = Math.round(st.progress * (panels.length - 1)) + dir;
      const k = Math.max(0, Math.min(panels.length - 1, i));
      scrollToY(st.start + (dist() * k) / (panels.length - 1));
    };
    const onPrev = () => step(-1), onNext = () => step(1);
    track.addEventListener("focusin", onFocus);
    prev.addEventListener("click", onPrev);
    next.addEventListener("click", onNext);

    return () => {
      sec.classList.remove("is-pinned");
      track.setAttribute("data-cursor", "drag");
      pin.style.height = "";
      ScrollTrigger.removeEventListener("refreshInit", setHeight);
      track.removeEventListener("focusin", onFocus);
      prev.removeEventListener("click", onPrev);
      next.removeEventListener("click", onNext);
      gsap.set(track, { clearProps: "transform" });
    };
  });

  /* ---------- Carrusel nativo (táctil, estrecho o movimiento reducido) ---------- */
  mm.add(`not all and ${MQ.desktop}`, () => {
    const stepSize = () => {
      const p = panels[0];
      return p.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
    };
    const behavior = reduce ? "auto" : "smooth";
    const onPrev = () => track.scrollBy({ left: -stepSize(), behavior });
    const onNext = () => track.scrollBy({ left: stepSize(), behavior });

    // Arrastre con ratón (en táctil manda el scroll nativo)
    let down = false, moved = false, startX = 0, startLeft = 0;
    const onDown = (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft; };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) { moved = true; track.classList.add("is-dragging"); }
      if (moved) track.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (moved) {
        track.classList.remove("is-dragging");
        track.scrollTo({ left: Math.round(track.scrollLeft / stepSize()) * stepSize(), behavior });
      }
    };
    const onClickCapture = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    const onKey = (e) => {
      if (e.target !== track) return;
      if (e.key === "ArrowRight") { e.preventDefault(); onNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); onPrev(); }
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
      setCount(Math.min(panels.length - 1, Math.round(p * (panels.length - 1))));
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    };
    const onScroll = () => requestAnimationFrame(update);

    track.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    track.addEventListener("click", onClickCapture, true);
    track.addEventListener("keydown", onKey);
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    prev.addEventListener("click", onPrev);
    next.addEventListener("click", onNext);
    update();

    return () => {
      track.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      track.removeEventListener("click", onClickCapture, true);
      track.removeEventListener("keydown", onKey);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      prev.removeEventListener("click", onPrev);
      next.removeEventListener("click", onNext);
      prev.disabled = next.disabled = false;
    };
  });
}
