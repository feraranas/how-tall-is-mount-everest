/** Storybook for the VANILLA site (no React): stories are plain functions
 *  returning DOM nodes / HTML strings, rendered by @storybook/html-vite.
 *  Vite is a dev-only dependency here — the production site stays a static
 *  no-build deploy (python3 -m http.server). */

/** @type {import('@storybook/html-vite').StorybookConfig} */
export default {
  framework: "@storybook/html-vite",
  stories: ["../stories/**/*.stories.js"],
  staticDirs: [
    // Expose site assets at the same absolute paths the CSS expects.
    { from: "../images", to: "/images" },
  ],
};
