/* ///////////////////////////////////////////////// */
/* ///////////// GLOBAL VARIABLES  ///////////////// */
/* ///////////////////////////////////////////////// */
let flag = false; /* FOR TITLE HEIGHT RESPONSIVENESS */
const totalHeight = 50000; /* FULL HEIGHT */
const mapHeight = 6800; /* FOR METRONOMO NORMALIZATION */

/* ///////////////////////////////////////////////// */
/* ////////////GET NECESSARY ELEMENTS////////////// */
/* ///////////////////////////////////////////////// */

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

// Throttle function to reduce scroll event calls
function throttle(callback, delay) {
  let isThrottled = false;
  return function () {
    if (!isThrottled) {
      callback.apply(this, arguments);
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, delay);
    }
  };
}

/* ///////////////////////////////////////////////// */
/* //////////////// EVENT LISTENERS //////////////// */
/* ///////////////////////////////////////////////// */

// UPDATE THE METRONOMO ON SCROLL EVENT
// Calculate pageHeight once outside the scroll event
const windowHeight = window.innerHeight;
console.log("window height: ", windowHeight);
const pageHeight = document.documentElement.scrollHeight - windowHeight;
console.log("scroll height: ", document.documentElement.scrollHeight);
console.log("scrollHeight - windowHeight", pageHeight);

// Function to update the metronomo on scroll event
function updateMetronomo() {
  const scrollPosition = window.pageYOffset;
  console.log("pageYOffset: ", scrollPosition);
  const normalizedHeight = Math.abs(
    (scrollPosition / pageHeight) * 6800 - mapHeight,
  );
  console.log("normalized height: ", normalizedHeight);

  if (scrollPosition > totalHeight - (windowHeight + 100)) {
    // IF REACHED THE BOTTOM DISAPPEAR
    /* DISAPPEAR METRO */
    metronomo.classList.remove("active");
  } else if (scrollPosition >= 0 && scrollPosition <= 350) {
    // IF REACHED THE TOP DISAPPEAR
    /* DISAPPEAR METRO */
    metronomo.classList.remove("active");
    /* APPEAR END SCREEN */
    endScreen.classList.add("active-end-screen");
  } else {
    /* APPEAR METRO */
    if (!metronomo.classList.contains("active")) {
      metronomo.classList.add("active");
    }
    /* DISAPPEAR END SCREEN */
    endScreen.classList.remove("active-end-screen");
  }

  let meters = (Math.round(`${normalizedHeight}`) + 2500)
    .toString()
    .padStart(5, "0");
  if (isNaN(meters)) {
    meters = "00000";
  }
  metronomoText.textContent = `${meters}m`;
}

// Add the throttled event listener to scroll Events
window.addEventListener("scroll", throttle(updateMetronomo, 25));

/* EVERYTIME RELOADS, GO TO THE BOTTOM OF THE PAGE WHICH IS WHERE WE START */
window.onload = function () {
  console.log(window.innerHeight);
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
  console.log(window.innerHeight);

  if (window.innerHeight <= 620) {
    removeBr();
    flag = true;
  }
  if (window.innerHeight > 620 && flag === true) {
    addBr();
    flag = false;
  }
};
