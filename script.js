/* ///////////////////////////////////////////////// */
/* ///////////// GLOBAL VARIABLES  ///////////////// */
/* ///////////////////////////////////////////////// */
let flag = false

/* ///////////////////////////////////////////////// */
/* /////////////AUXILIARY FUNCTIONS///////////////// */
/* ///////////////////////////////////////////////// */
// removes <br> tags from title when height < 920px
function removeBr() {
  let title = document.querySelector('#title')
  let titleDiv = document.querySelector('.title')
  let brElements = document.querySelectorAll('#title br')
  brElements.forEach(function(brElement) {
    brElement.remove();
  });
  title.style.fontSize = 'calc(2rem + 2vw)'
  titleDiv.style.width = '80%'
}
// adds <br> tags for title when height >= 920px
function addBr() {
  let title = document.querySelector('#title')
  let titleDiv = document.querySelector('.title')
  let t1Element = document.querySelector('#t1');
  let t2Element = document.querySelector('#t2');
  let t3Element = document.querySelector('#t3');
  let brElement = document.createElement('br');
  title.style.fontSize = 'calc(6rem + 2vw)';
  titleDiv.style.width = '35%'
  t1Element.appendChild(brElement);
  t2Element.appendChild(brElement);
  t3Element.appendChild(brElement);
}

/* ///////////////////////////////////////////////// */
/* ////////////GET NECESSARY ELEMENTS////////////// */
/* ///////////////////////////////////////////////// */
// Retrieve the metronomo element
const metronomo = document.querySelector('.metronomo');

const mapHeight = 10000;

// Add a scroll event listener to update the metronomo position
window.addEventListener('scroll', () => {
     const scrollPosition = window.pageYOffset;
     const windowHeight = window.innerHeight;
     const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
     const normalizedHeight = Math.abs(((scrollPosition / pageHeight) * 10000) - mapHeight);

     if (scrollPosition <= 48800) { metronomo.style.visibility = 'visible'; } 
     else { metronomo.style.visibility = 'hidden'}
     metronomo.style.top = `${scrollPosition}px`;
     metronomo.textContent = `${normalizedHeight}px`;
   });

/* EVERYTIME RELOADS, GO TO THE BOTTOM OF THE PAGE WHICH IS WHERE WE START */
window.onload = function () {
  if (window.innerHeight <= 920) {
    removeBr()
    flag = true
  }
  if (window.innerHeight > 920 && flag === true) {
    addBr()
  } 
  
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 0)
}

window.onresize = function () {
  console.log(window.innerHeight)
  
  if (window.innerHeight <= 920) {
    removeBr()
    flag = true
  }
  if (window.innerHeight > 920 && flag === true) {
    addBr()
    flag = false
  } 
}

