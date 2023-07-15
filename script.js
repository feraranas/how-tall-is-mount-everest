/* GET NECESSARY ELEMENTS */
// Retrieve the metronomo element
const metronomo = document.querySelector('.metronomo');

const mapHeight = 10000;

// Add a scroll event listener to update the metronomo position
window.addEventListener('scroll', () => {
     const scrollPosition = window.pageYOffset;
     const windowHeight = window.innerHeight;
     const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
     const normalizedHeight = Math.abs(((scrollPosition / pageHeight) * 10000) - mapHeight);

     if (scrollPosition <= 49900) { metronomo.style.visibility = 'visible'; } 
     else { metronomo.style.visibility = 'hidden'}
     metronomo.style.top = `${scrollPosition}px`;
     metronomo.textContent = `${normalizedHeight}px`;
   });

/* EVERYTIME RELOADS, GO TO THE BOTTOM OF THE PAGE WHICH IS WHERE WE START */
window.onload = function () {
     setTimeout(() => {
       window.scrollTo(0, document.body.scrollHeight);
     }, 0)
}