// function random(max) {
//      return Math.floor(Math.random() * max);
//    }
   
//    // containerCount = 3
// function createShootingStarContainers(containerCount) {
//      const styles = [];
   
//      for (let j = 1; j <= containerCount; j++) {
//        styles.push(`
//          .shootingStarContainer:nth-child(${j}) {
//            position: absolute;
//            width: 100%;
//            height: 130%;
//            transform: rotate(${random(10) + 35}deg);
//            z-index: 10;
//          }
//        `);
//      }
   
//      return styles.join("\n");
//    }
   
//    // shootingStar = 10
// function createShootingStars(containerCount, starCount) {
//      const styles = [];
   
//      for (let j = 1; j <= containerCount; j++) {
//        for (let i = 1; i <= starCount; i++) {
//          const delay = random(60000) + "ms";
//          const duration = random(2000) + 750 + "ms";
//          const left = random(50) + "%";
//          const top = random(98) + 1 + "%";
//          const opacity = random(75) / 100 + 0.15;
   
//          styles.push(`
//            .shootingStarContainer:nth-child(${j}) .shootingStar:nth-child(${i}) {
//                position: absolute;
//                height: 1px;
//                background: linear-gradient(-70deg, rgba(255, 235, 235, 1), rgba(0, 0, 0, 1));
//                left: calc(${left});
//                top: calc(${top});
//                animation: shootingFrames ${duration} ease-in-out ${delay};
//                opacity: ${opacity};
//            }
//          `);
//        }
//      }
   
//      return styles.join("\n");
// }

// // Function to start animations
// function startAnimations() {
//      animateShootingStars();
//      setInterval(animateShootingStars, 60000); // Re-run the animation every minute
//  }
 
//  // Run the animations when the page loads
//  window.addEventListener('load', startAnimations);
