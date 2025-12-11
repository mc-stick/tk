import React from "react";

// const FullscreenButton = () => {
  const handleFullscreen = () => {
    const elem = document.documentElement; // toda la página

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
      elem.msRequestFullscreen();
    }
  };

//   return (
//     // <button onClick={handleFullscreen}>
//     //   Pantalla Completa
//     // </button>
//   );
// };

export default handleFullscreen;
