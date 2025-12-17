import { useTurno } from "../../context/TurnoContext.jsx";
import { useEffect, useState, useRef } from "react";
import DateTime from "../../widgets/DateTime.jsx";


const DisplayScreen = () => {
  const { turnoActual, cola, totalatend } = useTurno();
  const [imagenes, setImagenes] = useState([]);
  const [actual, setActual] = useState(0);
  const intervalRef = useRef(null);
  //const [usuarioLlamado, setUsuarioLlamado] = useState(null);

  const services = import.meta.env.VITE_SERVICE_API;

  const API_URL = `${services}/img`; // Ajusta según tu backend
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

  return (<>
    {/* <div className="flex h-full w-full overflow-hidden z-0"> */}
      {/* <DateTime /> */}
      {/* <LeftBar data={{ turnoActual, cola, DateTime, ImgCustoms, totalatend }} /> */}

      <div className="flex bg-black h-screen w-screen  justify-center items-center  ">
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
              className="fade-image h-full w-full object-fill pt-80"
              onLoad={(e) => e.target.classList.remove("fade-out")}
            />
          )
        ) : (
          <p className="text-8xl " style={{ color: "#ccc" }}>Sin archivos disponibles</p>
        )}
      </div>
    {/* </div> */}
    </>
  );
};

export default DisplayScreen;
