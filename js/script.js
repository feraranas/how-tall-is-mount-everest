/* ///////////////////////////////////////////////// */
/* ///////////// GLOBAL VARIABLES  ///////////////// */
/* ///////////////////////////////////////////////// */

let flag = false; // FOR TITLE HEIGHT RESPONSIVENESS
const totalHeight = PAGE_HEIGHT; // FULL HEIGHT (see js/scene.js)
const mapHeight = MAP_HEIGHT; // FOR METRONOMO NORMALIZATION (see js/scene.js)
const threeThousander = 44500 + window.innerHeight;// THREE THOUSANDER DIVIDER

/* ///////////////////////////////////////////////// */
/* ////////////GET NECESSARY ELEMENTS////////////// */
/* ///////////////////////////////////////////////// */

// Get the divider container's
const threeThousanderContainer = document.querySelector('.three-thousander');

// Get the metronomo element
const metronomo = document.querySelector(".metronomo-wrapper");
const metronomoText = metronomo.querySelector(".metronomo");

// Get end screen
const endScreen = document.querySelector(".end-title");

/* ///////////////////////////////////////////////// */
/* /////////////AUXILIARY FUNCTIONS///////////////// */
/* ///////////////////////////////////////////////// */

// removes <br> tags from title when height < 920px
function removeBr() {
  let title = document.querySelector("#title");
  let titleDiv = document.querySelector(".title");
  let brElements = document.querySelectorAll("#title br");
  brElements.forEach(function (brElement) {
    brElement.remove();
  });
  title.style.fontSize = "calc(2rem + 2vw)";
  titleDiv.style.width = "80%";
}
// adds <br> tags for title when height >= 920px
function addBr() {
  let title = document.querySelector("#title");
  let titleDiv = document.querySelector(".title");
  let t1Element = document.querySelector("#t1");
  let t2Element = document.querySelector("#t2");
  let t3Element = document.querySelector("#t3");
  let brElement = document.createElement("br");
  title.style.fontSize = "calc(6rem + 2vw)";
  titleDiv.style.width = "35%";
  t1Element.appendChild(brElement);
  t2Element.appendChild(brElement);
  t3Element.appendChild(brElement);
}

// requestAnimationFrame ticking guard: coalesce scroll events into one
// metronome update per frame.
let scrollTicking = false;
function onScroll() {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      updateMetronomo();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}

/* ///////////////////////////////////////////////// */
/* //////////////// EVENT LISTENERS //////////////// */
/* ///////////////////////////////////////////////// */

// UPDATE THE METRONOMO ON SCROLL EVENT
// Calculate pageHeight once outside the scroll event
const windowHeight = window.innerHeight;
const pageHeight = document.documentElement.scrollHeight - windowHeight;

// Function to update the metronomo on scroll event
function updateMetronomo() {
  const scrollPosition = window.pageYOffset;
  const normalizedHeight = Math.abs(
    (scrollPosition / pageHeight) * MAP_HEIGHT - mapHeight
  );

  if (scrollPosition > totalHeight - (windowHeight + 100)) { // IF REACHED THE BOTTOM DISAPPEAR
    /* DISAPPEAR METRO */
    metronomo.classList.remove("active");
  } 
  else if (scrollPosition >= 0 && scrollPosition <= 350) { // IF REACHED THE TOP DISAPPEAR
    /* DISAPPEAR METRO */
    metronomo.classList.remove("active");
    /* APPEAR END SCREEN */
    endScreen.classList.add("active-end-screen");
  }
  else {
    /* APPEAR METRO */
    if (!metronomo.classList.contains('active')) {
      metronomo.classList.add('active')
    }
    /* DISAPPEAR END SCREEN */
    endScreen.classList.remove('active-end-screen')
  }

  if (scrollPosition > threeThousander + 200 || scrollPosition < threeThousander - 100) {
    threeThousanderContainer.classList.remove('active-divider')
  } else {
    threeThousanderContainer.classList.add('active-divider')
  }

  let meters = (Math.round(`${normalizedHeight}`) + SUMMIT_OFFSET)
    .toString()
    .padStart(5, "0");
  if (isNaN(meters)) {
    meters = "00000";
  }
  metronomoText.textContent = `${meters}m`;
}

// Add the rAF-throttled event listener to scroll Events
window.addEventListener('scroll', onScroll);

/* Escape closes a keyboard-opened info panel (panels open via :focus-within,
   so dropping focus closes them). Hover-opened panels are unaffected. */
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const el = document.activeElement;
  if (el && el.closest('.mountain-data, .illustration-data')) el.blur();
});



/* EVERYTIME RELOADS, GO TO THE BOTTOM OF THE PAGE WHICH IS WHERE WE START */
window.onload = function () {
  if (window.innerHeight <= 620) {
    removeBr();
    flag = true;
  }
  if (window.innerHeight > 620 && flag === true) {
    addBr();
  }

  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 0);
};

/* TITLE RESPONSIVENESS */
window.onresize = function () {
  if (window.innerHeight <= 620) {
    removeBr();
    flag = true;
  }
  if (window.innerHeight > 620 && flag === true) {
    addBr();
    flag = false;
  }
};
