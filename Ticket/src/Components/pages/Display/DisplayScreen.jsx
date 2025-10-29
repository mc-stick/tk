import { useTurno } from "../../context/TurnoContext.jsx";
import { useEffect, useState, useRef } from "react";
import "./DisplayScreen.css";

import DateTime from "../../widgets/DateTime.jsx";
import ImgCustoms from "../../widgets/ImgCustoms.jsx";
import LeftBar from "./ComponentsD/LeftBar.jsx";

const DisplayScreen = () => {
  const { turnoActual, cola, totalatend } = useTurno();
  const [imagenes, setImagenes] = useState([]);
  const [actual, setActual] = useState(0);
  const intervalRef = useRef(null);
  //const [usuarioLlamado, setUsuarioLlamado] = useState(null);

  const API_URL = "http://localhost:4001/api/img"; // Ajusta según tu backend
  //console.log(turnoActual, cola,"desde display screen")

  // Función para traer imágenes desde la DB
  const fetchImagenes = async () => {
    try {
      const res = await fetch(API_URL);
      const dataDB = await res.json();

      const imagenesActivas = await Promise.all(
        dataDB
          .filter((img) => img.estado === 1)
          .map(async (img) => {
            const blobRes = await fetch(`${API_URL}/${img.id}`);
            const blob = await blobRes.blob();
            return {
              url: URL.createObjectURL(blob),
              tipo: blob.type,
            };
          })
      );

      setImagenes(imagenesActivas);
      setActual(0);
    } catch (error) {
      console.error("Error al cargar imágenes desde la base de datos:", error);
    }
  };

  useEffect(() => {
    fetchImagenes(); // Carga inicial

    // window.addEventListener("nuevoTurnoLlamado", (e) => {
    //   setUsuarioLlamado(e.detail.user);
    // });

    window.addEventListener("finalizarUltimoTurno", () => {
      window.location.reload();
    });
  }, []);

  const esVideo = (archivo) =>
    archivo.tipo?.startsWith("video/") || /\.(mp4|webm|ogg)$/i.test(archivo.url);

  // Maneja el cambio automático de imágenes
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (imagenes.length === 0) return;

    if (!esVideo(imagenes[actual])) {
      intervalRef.current = setInterval(() => {
        const imageElement = document.querySelector(".fade-image");
        if (imageElement) {
          imageElement.classList.add("fade-out");
          setTimeout(() => {
            const nextIndex = (actual + 1) % imagenes.length;

            // Si ya mostramos todas las imágenes, recargar desde DB
            if (nextIndex === 0) {
              fetchImagenes(); // refresca desde DB
            }

            setActual(nextIndex);
          }, 1000);
        }
      }, 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [imagenes, actual]);

  return (
    <div className="pantalla-layout">
      <DateTime />
      <LeftBar data={{ turnoActual, cola, DateTime, ImgCustoms, totalatend }} />

      <div className="imagen-panel">
        {imagenes.length > 0 ? (
          esVideo(imagenes[actual]) ? (
            <video
              key={imagenes[actual].url}
              src={imagenes[actual].url}
              autoPlay
              muted
              className="fade-image"
              onEnded={() => {
                const nextIndex = (actual + 1) % imagenes.length;
                if (nextIndex === 0) fetchImagenes();
                setActual(nextIndex);
              }}
            />
          ) : (
            <img
              src={imagenes[actual].url}
              alt={`img-${actual}`}
              className="fade-image"
              onLoad={(e) => e.target.classList.remove("fade-out")}
            />
          )
        ) : (
          <p style={{ color: "#ccc" }}>Sin archivos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default DisplayScreen;
