/* =========================================================
   Apertura + hero
   - Apertura: las dos mitades del isotipo (recortadas del trazo del manual, sin redibujar)
     entran desfasadas y encajan; la cortina sube y entra el titular. Una vez por sesión.
   - Muro curvo de trabajo real: columnas a velocidades distintas que se sincronizan
     (misma velocidad y filas alineadas) a medida que se baja. Ligera inclinación con el ratón.
   ========================================================= */
import { reduce, root, MQ, lockScroll } from "./core.js";

const { gsap } = window;

export function initHero() {
  const hero = document.getElementById("top");
  if (!hero) return;
  const tilt = hero.querySelector(".wall__tilt");
  const wall = hero.querySelector(".wall");
  const tracks = Array.from(hero.querySelectorAll(".wall__track"));
  const lines = () => hero.querySelectorAll(".hero__title .ln > span");
  const intro = hero.querySelectorAll(".intro");

  /* ---------- Entrada ---------- */
  function prepare() {
    gsap.set(lines(), { yPercent: 105, y: 0 });
    gsap.set(intro, { opacity: 0, y: 14 });
    root.classList.remove("hero-pre");
  }
  function heroIn(delay = 0) {
    gsap.to(lines(), { yPercent: 0, duration: 1.3, stagger: 0.09, delay, ease: "expo.out" });
    gsap.to(intro, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, delay: delay + 0.35, ease: "expo.out", clearProps: "transform" });
  }

  if (root.classList.contains("is-opening") && !reduce) {
    runOpening(prepare, () => heroIn(0));
  } else if (root.classList.contains("hero-pre") && !reduce) {
    prepare();
    heroIn(0.05);
  } else {
    root.classList.remove("hero-pre", "is-opening");
  }

  /* ---------- Muro: cuatro tandas iguales por columna para un bucle sin huecos (también en vertical) ---------- */
  const SETS = 4;
  tracks.forEach((tr) => {
    const originals = Array.from(tr.children);
    for (let k = 1; k < SETS; k++) originals.forEach((n) => tr.appendChild(n.cloneNode(true)));
  });
  if (reduce) return;

  const speeds = [16, -12, 20, -15, 18, -11, 14];       // px/s: positivo sube, negativo baja
  const phases = tracks.map((_, i) => (i * 173) % 400);  // desfase inicial de cada columna
  const state = { p: 0 };                               // 0 = desfasadas · 1 = en sincronía
  let H = 1, t0 = performance.now(), running = false;

  const measure = () => { H = Math.max(1, (tracks[0].scrollHeight + parseFloat(getComputedStyle(tracks[0]).rowGap || 0)) / SETS); };
  measure();
  window.addEventListener("resize", measure);

  function tick() {
    const t = (performance.now() - t0) / 1000;
    const p = state.p;
    for (let i = 0; i < tracks.length; i++) {
      const own = phases[i] + speeds[i] * t;
      const common = 12 * t;
      let y = own * (1 - p) + common * p;
      y = ((y % H) + H) % H;
      tracks[i].style.transform = `translate3d(0,${(-y).toFixed(2)}px,0)`;
    }
  }
  const play = (on) => {
    if (on === running) return;
    running = on;
    on ? gsap.ticker.add(tick) : gsap.ticker.remove(tick);
  };
  play(true);

  const mm = gsap.matchMedia();
  mm.add(MQ.motion, () => {
    gsap.set(wall, { rotateX: 6 });
    // Al bajar: las columnas se sincronizan, el muro se aleja y el titular se despide
    gsap.timeline({
      scrollTrigger: {
        trigger: hero, start: "top top", end: "bottom top", scrub: true,
        onToggle: (self) => play(self.isActive || self.progress < 1),
        onLeaveBack: () => play(true),
      },
    })
      .to(state, { p: 1, ease: "none" }, 0)
      .to(wall, { scale: 0.9, rotateX: 16, ease: "none" }, 0)
      .to(hero.querySelector(".hero__inner"), { yPercent: -14, opacity: 0.25, ease: "none" }, 0);
  });

  // Inclinación con el ratón (solo puntero fino)
  mm.add(MQ.desktop, () => {
    const rx = gsap.quickTo(tilt, "rotateX", { duration: 1.2, ease: "power3" });
    const ry = gsap.quickTo(tilt, "rotateY", { duration: 1.2, ease: "power3" });
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ry(nx * 5); rx(-ny * 3);
    };
    hero.addEventListener("pointermove", onMove);
    return () => hero.removeEventListener("pointermove", onMove);
  });
}

/* ---------- Apertura ---------- */
function runOpening(prepare, onReveal) {
  const ov = document.querySelector(".opening");
  if (!ov) { root.classList.remove("is-opening"); return onReveal(); }
  const a = ov.querySelector(".half--a");
  const b = ov.querySelector(".half--b");
  const glow = ov.querySelector(".opening__glow");
  lockScroll(true);

  const finish = () => {
    root.classList.remove("is-opening");
    lockScroll(false);
    try { sessionStorage.setItem("syncro-opened", "1"); } catch (e) { /* modo privado */ }
    ov.remove();
    removeSkip();
  };
  const tl = gsap.timeline({ onComplete: finish });
  tl.set([a, b], { opacity: 1 })
    .fromTo(a, { x: -150, y: -70, rotate: -32, svgOrigin: "185 130" }, { x: 0, y: 0, rotate: 0, duration: 0.85, ease: "expo.out" }, 0.1)
    .fromTo(b, { x: 150, y: 70, rotate: -32, svgOrigin: "185 130" }, { x: 0, y: 0, rotate: 0, duration: 0.85, ease: "expo.out" }, 0.1)
    .fromTo(glow, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 0.62)
    .call(prepare, null, 0.84)
    .to(ov, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.72, ease: "power4.inOut" }, 0.86)
    .call(onReveal, null, 1.02);

  // Cualquier gesto acelera la apertura
  const skip = () => tl.timeScale(5);
  const evs = ["keydown", "pointerdown", "wheel", "touchstart"];
  evs.forEach((ev) => window.addEventListener(ev, skip, { passive: true }));
  function removeSkip() { evs.forEach((ev) => window.removeEventListener(ev, skip)); }
}
