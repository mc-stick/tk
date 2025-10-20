import { useTurno } from "../../context/TurnoContext.jsx";
import { useEffect, useState, useRef } from "react";
import "./DisplayScreen.css";

import DateTime from "../../widgets/DateTime.jsx";
import ImgCustoms from "../../widgets/ImgCustoms.jsx"
import LeftBar from "./ComponentsD/LeftBar.jsx";

const DisplayScreen = () => {
  const { turnoActual, cola } = useTurno();
  const [imagenes, setImagenes] = useState([]);
  const [actual, setActual] = useState(0);
  const intervalRef = useRef(null);
  const [usuarioLlamado, setUsuarioLlamado] = useState(null);

  useEffect(() => {
    const cargarImagenes = () => {
      const data = JSON.parse(localStorage.getItem("imagenes")) || [];
      setImagenes(data);
      setActual(0);
    };
    

    window.addEventListener("nuevoTurnoLlamado", (e) => {
      setUsuarioLlamado(e.detail.user);
      
    });

    window.addEventListener("finalizarUltimoTurno", () => {
      window.location.reload(); // o setTurnoActual(null) si tienes forma de vaciarlo sin recargar
    });

    cargarImagenes();
    window.addEventListener("imagenesActualizadas", cargarImagenes);
    return () =>
      window.removeEventListener("imagenesActualizadas", cargarImagenes);
  }, []);

  const esVideo = (archivo) =>
    /\.(mp4|webm|ogg)$/i.test(archivo) || archivo.startsWith("data:video");

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (imagenes.length === 0) return;

    if (!esVideo(imagenes[actual])) {
      //solo cambia bruscamente la imagen
      // intervalRef.current = setInterval(() => {
      //   setActual((prev) =>
      //     imagenes.length ? (prev + 1) % imagenes.length : 0
      //   );
      // }, 2000);

      //animacion de fade in out
      intervalRef.current = setInterval(() => {
        const imageElement = document.querySelector(".fade-image");
        if (imageElement) {
          imageElement.classList.add("fade-out");

          setTimeout(() => {
            setActual((prev) =>
              imagenes.length ? (prev + 1) % imagenes.length : 0
            );
          }, 1000); // Espera el fade-out antes de cambiar
        }
      }, 4000); // Tiempo total (mostrar 3s + 1s transición)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [imagenes, actual]);

  return (<>
    <div className="pantalla-layout">
      <DateTime />
      <LeftBar data={{turnoActual, cola, DateTime, ImgCustoms}}/>
 
      <div className="imagen-panel">
        
        {imagenes.length > 0 ? (
          <>
            {/* {esVideo(imagenes[actual]) ? (
              <video
                key={imagenes[actual]}
                src={imagenes[actual]}
                autoPlay
                muted
                //controls
                onEnded={() =>
                  setActual((prev) =>
                    imagenes.length ? (prev + 1) % imagenes.length : 0
                  )
                }
              />
            ) : (
              <img src={imagenes[actual]} alt={`img-${actual}`} />
            )} */}

            {esVideo(imagenes[actual]) ? (
              <video
                key={imagenes[actual]}
                src={imagenes[actual]}
                autoPlay
                muted
                className="fade-image"
                onEnded={() =>
                  setActual((prev) =>
                    imagenes.length ? (prev + 1) % imagenes.length : 0
                  )
                }
              />
            ) : (
              <img
                src={imagenes[actual]}
                alt={`img-${actual}`}
                className="fade-image"
                onLoad={(e) => e.target.classList.remove("fade-out")}
              />
            )}
          </>
        ) : (
          <p style={{ color: "#ccc" }}>Sin archivos disponibles</p>
        )}
      </div>
      
    </div>
    </>
  );
};

export default DisplayScreen;
