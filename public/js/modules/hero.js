/* =========================================================
   Apertura + hero
   - Apertura al estilo de la precarga de Marea: campo de caracteres que ondula, etiqueta
     y contador 000 → 100; la cortina sube y entra el titular. Una vez por sesión.
   - Muro curvo con los fotogramas del spot: columnas a velocidades distintas que se sincronizan
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

/* ---------- Apertura (al estilo de la precarga de Marea) ----------
   Campo de caracteres en <canvas>: dos ondas desfasadas que se van alineando
   ("en sincronía") mientras el contador llega a 100. Después la cortina sube. */
function runOpening(prepare, onReveal) {
  const ov = document.querySelector(".opening");
  if (!ov) { root.classList.remove("is-opening"); return onReveal(); }
  const canvas = ov.querySelector(".opening__canvas");
  const ctx = canvas.getContext("2d");
  const countEl = ov.querySelector(".opening__count span");
  const CHARS = " .·:-=+*#%@";
  const state = { v: 0, sync: 0 };
  const t0 = performance.now();
  let w = 0, h = 0, raf = 0, frame = 0;

  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  window.addEventListener("resize", size);

  const draw = (now) => {
    raf = requestAnimationFrame(draw);
    if (frame++ % 2) return;                          // 30 fps: sobra para una textura y cuesta la mitad
    const t = (now - t0) / 1000;
    const phase = (1 - state.sync) * 2.4;             // el desfase desaparece al llegar a 100
    ctx.fillStyle = "#1C1C1C";
    ctx.fillRect(0, 0, w, h);
    ctx.font = '500 12px "Montserrat", ui-monospace, monospace';
    for (let y = 0; y < h; y += 16) {
      for (let x = 0; x < w; x += 11) {
        const a = Math.sin(x * 0.012 + t * 1.6 + Math.sin(y * 0.01 + t) * 1.5) * 0.5 + 0.5;
        const b = Math.sin(y * 0.018 - t * 1.2 + x * 0.004 + phase) * 0.5 + 0.5;
        const o = Math.min(0.999, Math.max(0, a * b * 1.25 - 0.05));
        const ch = CHARS[(o * CHARS.length) | 0];
        if (ch === " ") continue;
        ctx.fillStyle = o > 0.82 ? `rgba(160,139,255,${(0.45 + o * 0.5).toFixed(2)})` : `rgba(240,241,255,${(0.1 + o * 0.6).toFixed(2)})`;
        ctx.fillText(ch, x, y + 12);
      }
    }
  };
  raf = requestAnimationFrame(draw);
  lockScroll(true);

  const finish = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", size);
    root.classList.remove("is-opening");
    lockScroll(false);
    try { sessionStorage.setItem("syncro-opened", "1"); } catch (e) { /* modo privado */ }
    ov.remove();
    removeSkip();
  };
  const tl = gsap.timeline({ onComplete: finish });
  tl.to(state, {
    v: 100, sync: 1, duration: 1.9, ease: "power2.inOut",
    onUpdate: () => { countEl.textContent = String(Math.round(state.v)).padStart(3, "0"); },
  })
    .call(prepare, null, "+=0.1")
    .to(ov, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: "expo.inOut" }, "+=0.05")
    .call(onReveal, null, "-=0.55");

  // Cualquier gesto acelera la apertura
  const skip = () => tl.timeScale(4);
  const evs = ["keydown", "pointerdown", "wheel", "touchstart"];
  evs.forEach((ev) => window.addEventListener(ev, skip, { passive: true }));
  function removeSkip() { evs.forEach((ev) => window.removeEventListener(ev, skip)); }
}
