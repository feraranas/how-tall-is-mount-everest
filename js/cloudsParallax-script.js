/* ///////////////////////////////////////////////// */
/* ////////////////// CLOUD PARALLAX /////////////// */
/* ///////////////////////////////////////////////// */
/* Clouds drift vertically as the page scrolls, scaled by depth (z-index):    */
/* nearer (higher-z) clouds move more, far ones barely. Motion is slow — the  */
/* clouds LAG the scroll (factor << 1) — bidirectional, and GPU-composited    */
/* via translate3d. Disabled entirely under prefers-reduced-motion.           */

(function () {
  // Tunables.
  const PARALLAX_MAX = 0.15; // max fraction of the scroll delta a cloud moves.
  const REFERENCE_SCROLL = 25000; // scroll position at which offset is zero.

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const clouds = Array.from(document.querySelectorAll(".cloud"));
  if (clouds.length === 0) return;

  // Depth factor from each cloud's z-index: factor = (z / maxZ) * PARALLAX_MAX.
  const zOf = (el) => {
    const z = parseInt(getComputedStyle(el).zIndex, 10);
    return Number.isNaN(z) ? 0 : z;
  };
  const maxZ = clouds.reduce((m, el) => Math.max(m, zOf(el)), 0) || 1;
  const layers = clouds.map((el) => ({
    el,
    factor: (zOf(el) / maxZ) * PARALLAX_MAX,
  }));

  function render() {
    const scrollY = window.pageYOffset;
    for (const { el, factor } of layers) {
      const offsetY = (REFERENCE_SCROLL - scrollY) * factor;
      // Preserve the -50% X centering; translate3d keeps it on the compositor.
      el.style.transform = `translate3d(-50%, ${offsetY}px, 0)`;
    }
  }

  // Passive scroll -> single rAF per frame (coalesce events, no layout thrash).
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      render();
      ticking = false;
    });
  }

  function enable() {
    window.addEventListener("scroll", onScroll, { passive: true });
    render();
  }
  function disable() {
    window.removeEventListener("scroll", onScroll);
    for (const { el } of layers) el.style.transform = "";
  }

  if (!reduceMotion.matches) enable();
  // React to the user toggling the preference at runtime.
  reduceMotion.addEventListener("change", (e) => (e.matches ? disable() : enable()));
})();
