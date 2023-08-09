/* ///////////////////////////////////////////////// */
/* //////////// GET NECESSARY ELEMENTS ///////////// */
/* ///////////////////////////////////////////////// */

// Get tab & arrow to appear the mountain data
const getInfoTab = document.querySelector(".fa-info");

/* ///////////////////////////////////////////////// */
/* ////////////// AUXILIARY FUNCTIONS ////////////// */
/* ///////////////////////////////////////////////// */

// Function to handle showing info
function showInfo(e) {
  const m = document.querySelector(
    `[data-key="${e.srcElement.dataset.mountainKey}"]`,
  );
  setTimeout(() => m.classList.add("show-info"), 100);
}
// Function to handle hiding info
function hideInfo(e) {
  const m = document.querySelector(
    `[data-key="${e.srcElement.dataset.mountainKey}"]`,
  );
  m.classList.remove("show-info");
}
// Helper function for debounce
function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}

/* ///////////////////////////////////////////////// */
/* //////////////// EVENT LISTENERS //////////////// */
/* ///////////////////////////////////////////////// */

// Appear mountain data on mouse enter event & disappear on mouseleave
// Debounced event listeners for better performance
function debouncedShow(e) {
  return debounce(showInfo(e), 100);
}
function debouncedHide(e) {
  return debounce(hideInfo(e), 100);
}

// Attach the debounced event listeners to the common parent element
const parentElement = Array.from(document.querySelectorAll(".fa-info"));
parentElement.forEach((item) => {
  item.addEventListener("mouseenter", debouncedShow);
  item.addEventListener("mouseleave", debouncedHide);
});
