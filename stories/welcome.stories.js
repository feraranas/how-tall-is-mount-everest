/* Placeholder story proving the html-vite pipeline boots; real component
   stories land under this directory in design-system step 4. */

export default {
  title: "Design System/Welcome",
};

export const Welcome = () => {
  const el = document.createElement("div");
  el.style.fontFamily = "'Playfair Display', serif";
  el.style.fontSize = "2.5rem";
  el.innerHTML =
    "<h1>How tall is Mount Everest — design system</h1>" +
    "<p>Vanilla HTML/CSS/JS components, cataloged with @storybook/html-vite.<br>" +
    "Component stories: clouds, mountain titles, info tooltips, illustrations.</p>";
  return el;
};
