/* ///////////////////////////////////////////////// */
/* /////////////// CLOUD HORIZONTAL DRIFT /////////// */
/* ///////////////////////////////////////////////// */
/* Clouds drift horizontally (independent of scroll): each one moves left or   */
/* right at a randomized, gentle speed, exits one screen edge and re-enters    */
/* from the opposite edge (wrap-around). Motion is per-cloud random (mixed     */
/* directions, varied speed) and depth-aware — nearer (higher z-index) clouds  */
/* drift faster. GPU-composited via translate3d. Disabled under               */
/* prefers-reduced-motion.                                                     */

(function () {
  // Tunables (px/second).
  const MIN_SPEED = 8;
  const MAX_SPEED = 22;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 1.1 — collect clouds; bail if none.
  const clouds = Array.from(document.querySelectorAll(".cloud"));
  if (clouds.length === 0) return;

  const rand = (min, max) => min + Math.random() * (max - min);

  // 1.2 — read a cloud's base transform once so flips/scaling survive. We take
  // over the X translation, but preserve scaleX (incl. sign, i.e. mirror flips)
  // and scaleY from whatever the CSS set (e.g. .cloud-38 scaleX(-1.5)).
  const baseScaleOf = (el) => {
    const t = getComputedStyle(el).transform;
    if (!t || t === "none") return { sx: 1, sy: 1 };
    try {
      const m = new DOMMatrixReadOnly(t);
      // Magnitude of the axis basis vectors; keep the sign of the X axis for flips.
      const sx = Math.hypot(m.a, m.b) * (m.a < 0 ? -1 : 1);
      const sy = Math.hypot(m.c, m.d) * (m.d < 0 ? -1 : 1);
      return { sx: sx || 1, sy: sy || 1 };
    } catch (_) {
      return { sx: 1, sy: 1 };
    }
  };

  const zOf = (el) => {
    const z = parseInt(getComputedStyle(el).zIndex, 10);
    return Number.isNaN(z) ? 0 : z;
  };
  const maxZ = clouds.reduce((m, el) => Math.max(m, zOf(el)), 0) || 1;

  // 1.3 — per-cloud randomized state (direction, depth-scaled speed, start x).
  const JITTER = 0.15; // ±15% per-cloud speed variety on top of the depth ramp.
  const layers = clouds.map((el) => {
    const { sx, sy } = baseScaleOf(el);
    const depth = zOf(el) / maxZ; // 0..1, nearer clouds -> ~1
    // Nearer clouds drift faster: depth sets the base speed (this ramp dominates
    // so depth ordering holds), then a small jitter adds per-cloud variety.
    const base = MIN_SPEED + depth * (MAX_SPEED - MIN_SPEED);
    const speed = base * (1 + rand(-JITTER, JITTER));
    return {
      el,
      sx,
      sy,
      dir: Math.random() < 0.5 ? -1 : 1, // mixed directions
      speed,
      x: 0, // set once bounds are measured
      span: 0, // half of the wrap travel (from center origin), set on measure
    };
  });

  // 1.4 — wrap bounds from viewport width + each cloud's own width. Elements
  // sit at left:50%, so x is measured relative to the horizontal center.
  function measure() {
    const halfViewport = window.innerWidth / 2;
    for (const layer of layers) {
      const w = layer.el.getBoundingClientRect().width || 0;
      // Off-screen margin so the cloud fully clears before wrapping.
      layer.span = halfViewport + w;
    }
  }

  // Seed random start positions across the wrap span (so clouds aren't aligned).
  function seedPositions() {
    for (const layer of layers) {
      layer.x = rand(-layer.span, layer.span);
    }
  }

  function apply(layer) {
    layer.el.style.transform =
      `translate3d(${layer.x}px, 0, 0) scaleX(${layer.sx}) scaleY(${layer.sy})`;
  }

  // 1.5 — rAF loop with delta-time and wrap-around.
  let rafId = null;
  let lastT = 0;
  const MAX_DT = 0.05; // clamp: after a throttled/backgrounded tab, don't leap.
  function frame(now) {
    const dt = lastT ? Math.min((now - lastT) / 1000, MAX_DT) : 0; // seconds
    lastT = now;
    for (const layer of layers) {
      layer.x += layer.dir * layer.speed * dt;
      // Wrap: once fully past one edge, re-enter from the opposite edge.
      if (layer.x > layer.span) layer.x = -layer.span;
      else if (layer.x < -layer.span) layer.x = layer.span;
      apply(layer);
    }
    rafId = window.requestAnimationFrame(frame);
  }

  // 1.6 — recompute bounds on resize (coalesced into a single rAF).
  let resizePending = false;
  function onResize() {
    if (resizePending) return;
    resizePending = true;
    window.requestAnimationFrame(() => {
      resizePending = false;
      measure();
      // Keep positions in range after a shrink.
      for (const layer of layers) {
        if (layer.x > layer.span) layer.x = layer.span;
        else if (layer.x < -layer.span) layer.x = -layer.span;
      }
    });
  }

  function enable() {
    measure();
    seedPositions();
    for (const layer of layers) apply(layer);
    window.addEventListener("resize", onResize, { passive: true });
    lastT = 0;
    rafId = window.requestAnimationFrame(frame);
  }

  function disable() {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    window.removeEventListener("resize", onResize);
    for (const layer of layers) layer.el.style.transform = "";
  }

  // 1.7 — honor prefers-reduced-motion, and react to runtime toggles.
  if (!reduceMotion.matches) enable();
  reduceMotion.addEventListener("change", (e) => (e.matches ? disable() : enable()));
})();
