/* ///////////////////////////////////////////////// */
/* ///////////// GLOBAL VARIABLES  ///////////////// */
/* ///////////////////////////////////////////////// */
let flag = false;          /* FOR TITLE HEIGHT RESPONSIVENESS */
const totalHeight = 50000; /* FULL HEIGHT */
const mapHeight = 8000;    /* FOR METRONOMO NORMALIZATION */

/* ///////////////////////////////////////////////// */
/* ////////////GET NECESSARY ELEMENTS////////////// */
/* ///////////////////////////////////////////////// */

// Get the metronomo element
const metronomo = document.querySelector(".metronomo-wrapper");
const metronomoText = metronomo.querySelector(".metronomo");

// Get end screen
const endScreen = document.querySelector(".end-title");

// Get tab & arrow to appear the mountain data
const getInfoTab = document.querySelector(".fa-info");
const mountain25 = document.querySelector(".nevado-colima-info");

// Appears tab for mountain data
function handleEnter() {
  setTimeout(() => mountain25.classList.add('trigger-enter-active'), 100);
  getInfoTab.style.borderRadius = "0px 0px 5px 5px"
  getInfoTab.style.width = "90%"
}
// Disappears tab for mountain data
function handleLeave() {
  mountain25.classList.remove('trigger-enter-active');
  getInfoTab.style.borderRadius = "0px 0px 0px 0px"
  getInfoTab.style.width = "50px"
}

/* ///////////////////////////////////////////////// */
/* /////////////AUXILIARY FUNCTIONS///////////////// */
/* ///////////////////////////////////////////////// */

// removes <br> tags from title when height < 920px
function removeBr() {
  let title = document.querySelector("#title");
  let titleDiv = document.querySelector(".title");
  let brElements = document.querySelectorAll("#title br");
  brElements.forEach(function(brElement) { brElement.remove(); });
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
// Function to handle showing info
function showInfo() { mountain25.classList.add('show-info'); }
// Function to handle hiding info
function hideInfo() { mountain25.classList.remove('show-info'); }
// Helper function for debounce
function debounce(func, delay) {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
}
// Throttle function to reduce scroll event calls
function throttle(callback, delay) {
  let isThrottled = false;
  return function() {
    if (!isThrottled) {
      callback.apply(this, arguments);
      isThrottled = true;
      setTimeout(() => { isThrottled = false; }, delay);
    }
  };
}

/* ///////////////////////////////////////////////// */
/* //////////////// EVENT LISTENERS //////////////// */
/* ///////////////////////////////////////////////// */

// Appear mountain data on mouse enter event & disappear on mouseleave
// Debounced event listeners for better performance
const debouncedShow = debounce(showInfo, 100);
const debouncedHide = debounce(hideInfo, 100);

// Attach the debounced event listeners to the common parent element
const parentElement = document.querySelector(
    ".mountain-25-data"); // Replace with the common parent element
parentElement.addEventListener('mouseenter', debouncedShow);
parentElement.addEventListener('mouseleave', debouncedHide);

// UPDATE THE METRONOMO ON SCROLL EVENT
// Calculate pageHeight once outside the scroll event
const windowHeight = window.innerHeight;
const pageHeight = document.documentElement.scrollHeight - windowHeight;
console.log(pageHeight)

// // RAIN
// var makeItRain = function() {
//   //clear out everything
//   $('.rain').empty();

//   var increment = 0;
//   var drops = "";
//   var backDrops = "";

//   while (increment < 100) {
//     //couple random numbers to use for various randomizations
//     //random number between 98 and 1
//     var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
//     //random number between 5 and 2
//     var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
//     //increment
//     increment += randoFiver;
//     //add in a new raindrop with various randomizations to certain CSS
//     properties drops += '<div class="drop" style="left: ' + increment + '%;
//     bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay:
//     0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div
//     class="stem" style="animation-delay: 0.' + randoHundo + 's;
//     animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat"
//     style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' +
//     randoHundo + 's;"></div></div>'; backDrops += '<div class="drop"
//     style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver -
//     1 + 100) + '%; animation-delay: 0.' + randoHundo + 's;
//     animation-duration: 0.5' + randoHundo + 's;"><div class="stem"
//     style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' +
//     randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' +
//     randoHundo + 's; animation-duration: 0.5' + randoHundo +
//     's;"></div></div>';
//   }

//   $('.rain.front-row').append(drops);
//   $('.rain.back-row').append(backDrops);
// }

// $('.splat-toggle.toggle').on('click', function() {
//   $('body').toggleClass('splat-toggle');
//   $('.splat-toggle.toggle').toggleClass('active');
//   makeItRain();
// });

// $('.back-row-toggle.toggle').on('click', function() {
//   $('body').toggleClass('back-row-toggle');
//   $('.back-row-toggle.toggle').toggleClass('active');
//   makeItRain();
// });

// $('.single-toggle.toggle').on('click', function() {
//   $('body').toggleClass('single-toggle');
//   $('.single-toggle.toggle').toggleClass('active');
//   makeItRain();
// });

// makeItRain();

// Function to update the appearance of mountain data
// function appearMountainData() {
//   const scrollPosition = window.pageYOffset;
//   if (scrollPosition >= 47000 && scrollPosition <= 48000) {
//     mountain25Data.classList.add("active-mountain-data");
//   } else {
//     mountain25Data.classList.remove("active-mountain-data");
//   }
// }

// Function to update the metronomo on scroll event
function updateMetronomo() {
  const scrollPosition = window.pageYOffset;
  const normalizedHeight =
      Math.abs((scrollPosition / pageHeight) * 8000 - mapHeight);

  if (scrollPosition > totalHeight - (windowHeight + 100)) {
    /* DISAPPEAR METRO */
    metronomo.classList.remove("active");
  } else if (scrollPosition >= 0 && scrollPosition <= 350) {
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

  let meters =
      (Math.round(`${normalizedHeight}`) + 2500).toString().padStart(5, "0");
  if (isNaN(meters)) {
    meters = "00000";
  }
  metronomoText.textContent = `${meters}m`;
}

// Add the throttled event listener to scroll Events
window.addEventListener('scroll', throttle(updateMetronomo, 25));

/* EVERYTIME RELOADS, GO TO THE BOTTOM OF THE PAGE WHICH IS WHERE WE START */
window.onload = function() {
  console.log(window.innerHeight);
  if (window.innerHeight <= 620) {
    removeBr();
    flag = true;
  }
  if (window.innerHeight > 620 && flag === true) {
    addBr();
  }

  setTimeout(() => { window.scrollTo(0, document.body.scrollHeight); }, 0);
};

/* TITLE RESPONSIVENESS */
window.onresize = function() {
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
