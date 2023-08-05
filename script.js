/* ///////////////////////////////////////////////// */
/* ///////////////// ANIMATIONS //////////////////// */
/* ///////////////////////////////////////////////// */
// ASHES -> https://codepen.io/maulik/pen/nXBMzz
// Name Space
var bg = bg || {};

// Get random int between two numbers
function randomRange(from, to, seed) {
  return Math.floor((seed ? seed : Math.random()) * (to - from + 1) + from);
}

// Fire
(function (b) {
  var cntr = document.getElementById("canvascontainer"),
    W = cntr.offsetWidth,
    H = cntr.offsetHeight,
    canvas = [
      document.getElementById("canvas"),
      document.getElementById("buffer"),
    ],
    ctxs = [canvas[0].getContext("2d"), canvas[1].getContext("2d")],
    C = 0,
    angle = 0,
    A = [],
    int;

  function ash(o) {
    var i,
      j,
      m = Math.random(),
      p = randomRange(4, 8, m);

    if (o && o.x) this.x = o.x;
    else this.x = m * W;
    if (o && o.y) this.y = o.y;
    else this.y = m * H;
    if (o && o.a) this.a = o.a;
    else this.a = m * (p - 4) + 1;
    this.r = randomRange(233, 255, m);
    this.g = randomRange(181, 192, m);
    this.b = randomRange(72, 88, m);

    if (o && o.dp) this.dp = o.dp;
    else {
      this.dp = [{ x: 0, y: 0 }];
      for (i = 0; i < p; i++) {
        j = i == 0 || p / 2 > i ? 1 : -1;
        this.dp.push({
          x: this.dp[i].x + randomRange(5, 30) * j,
          y: this.dp[i].y + randomRange(5, 30) * j,
        });
      }
    }
  }

  function draw() {
    var grad, i, j, p, ctx;
    if (C == 0) {
      // Show the canvas
      canvas[0].style.visibility = "visible";
      canvas[1].style.visibility = "hidden";
      C = 1;
    } else {
      // Show the buffer
      canvas[1].style.visibility = "visible";
      canvas[0].style.visibility = "hidden";
      C = 0;
    }

    ctx = ctxs[C];
    ctx.clearRect(0, 0, W, H);

    for (i = 0; i < A.length; i++) {
      p = A[i];
      grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.a);
      grad.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 1)");
      grad.addColorStop(
        0.9,
        "rgba(" +
          p.r +
          ", " +
          p.g +
          ", " +
          p.b +
          ", " +
          randomRange(1, 10) / 10 +
          ")",
      );
      grad.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      for (j = 1; j < p.dp.length; j++)
        ctx.lineTo(p.x + p.dp[j].x, p.y + p.dp[j].y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.7;
      ctx.fill();
    }

    update();
  }

  function update() {
    var i, p;
    angle += 0.01;

    for (i = 0; i < A.length; i++) {
      p = A[i];

      p.y += Math.cos(angle + A.length) + 1 + p.a / 2;
      p.x += Math.sin(angle) * 2;

      if (p.x > W + 5 || p.x < -5 || p.y > H) {
        if (i % 3 > 0) A[i] = new ash({ y: -10, a: p.a, d: p.d, dp: p.dp });
        else {
          // Enter from the left
          if (Math.sin(angle) > 0)
            A[i] = new ash({ x: -5, a: p.a, d: p.d, dp: p.dp });
          // Enter from the right
          else A[i] = new ash({ x: W + 5, a: p.a, d: p.d, dp: p.dp });
        }
      }
    }
  }

  // Run
  canvas[0].width = W;
  canvas[0].height = H;
  canvas[1].width = W;
  canvas[1].height = H;
  for (var i = 0; i < 50; i++) A.push(new ash());
  setInterval(draw, 33);
})(bg);

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

// Get tab & arrow to appear the mountain data
const getInfoTab = document.querySelector(".fa-info");

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

// UPDATE THE METRONOMO ON SCROLL EVENT
// Calculate pageHeight once outside the scroll event
const windowHeight = window.innerHeight;
const pageHeight = document.documentElement.scrollHeight - windowHeight;

// Function to update the metronomo on scroll event
function updateMetronomo() {
  const scrollPosition = window.pageYOffset;
  const normalizedHeight = Math.abs(
    (scrollPosition / pageHeight) * 6800 - mapHeight,
  );

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
