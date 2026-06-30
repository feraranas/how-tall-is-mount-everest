/* ///////////////////////////////////////////////// */
/* /////////////// CANVAS CONSTANTS //////////////// */
/* ///////////////////////////////////////////////// */
/* Single source of truth for canvas dimensions.      */
/* Loaded before script.js so its globals are shared.  */

const PAGE_HEIGHT = 50000;      // full scrollable canvas height (px)
const MAP_HEIGHT = 6800;        // metronome normalization range
const SUMMIT_OFFSET = 2500;     // base meters reading added to the metronome
const MOUNTAIN_SPACING = 2500;  // vertical gap between mountains

// Inject CSS vars from the constants at boot so CSS and JS cannot drift.
document.documentElement.style.setProperty('--page-height', `${PAGE_HEIGHT}px`);
document.documentElement.style.setProperty('--half-page-height', `${PAGE_HEIGHT / 2}px`);
