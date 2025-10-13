import { useTurno } from "../context/TurnoContext";
import { useEffect, useState, useRef } from "react";
import "./DisplayScreen.css";

import DateTime from "../widgets/DateTime.jsx";
import ImgCustoms from "../widgets/ImgCustoms.jsx";
import ImgLogo from "../../assets/img/ucne_logo_Text.png";

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

  return (
    <div className="pantalla">
      {(turnoActual || cola.length > 0) && (
        <div className="turno-panel">
          <div className="div_logo">
            <ImgCustoms src={ImgLogo} width="50%" />
            <DateTime />
          </div>
          <hr className="full-width" />
          <h1>ATENDIENDO</h1>

          {/* ///////////////////////////////////// */}
          {turnoActual ? (
            <>
              <table className="turno-tabla">
                <thead>
                  <tr>
                    <th className="turno-header">Turno</th>
                    <th className="turno-header">Puesto</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="turno-celda turno-fontstyle">
                      {turnoActual
                        ? `${turnoActual.tipo[0].toUpperCase()}-${
                            turnoActual.numero
                          }`
                        : "—"}
                    </td>
                    <td className="turno-celda turno-fontstyle">
                      {turnoActual?.puesto != null
                        ? `Caja ${turnoActual.puesto}`
                        : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <p className=" turno-header turno-fontstyle">EN ESPERA.</p>
          )}

          {/* {usuarioLlamado && (
            <div className="turno-operador">
              Operador: <strong>{usuarioLlamado}</strong>
            </div>
          )} */}
          <hr className="full-width" />

          <div className="turno-espera">
            <div className="" style={{}}>
              {cola != 0 ? (
                <>
                  <h2 style={{ marginLeft: "25%" }}>TURNOS EN ESPERA</h2>
                  <table className="turno-tabla">
                    <tbody>
                      <tr>
                        <td>
                          <ul className="turno-lista-scroll">
                            {cola.slice(0, 10).map((t, i) => (
                              <li key={i}>
                                {`${t.tipo[0].toUpperCase()}-${t.numero}`} (
                                {t.tipo})
                              </li>
                            ))}
                            <br />
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <h2></h2>
              )}

              {/* <ul>
              {cola.slice(0, 10).map((t, i) => (
                <li key={i}>
                  {`${t.tipo[0].toUpperCase()}-${t.numero}`} ({t.tipo})
                </li>
              ))}
            </ul> */}
            </div>
          </div>
        </div>
      )}

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
      {/* 
        {(turnoActual || cola.length > 0) && (
        <div className="turno-panel">
          <h1>Turnos de Citas</h1>
          <div className="turno-num">
            {turnoActual
              ? `${turnoActual.tipo[0].toUpperCase()}-${turnoActual.numero}`
              : "—"}
          </div>

          {usuarioLlamado && (
            <div className="turno-operador">
              Operador: <strong>{usuarioLlamado}</strong>
            </div>
          )}

          <div className="proximos">
            <h2>Horario de citas:</h2>
            <ul>
              {cola.slice(0, 10).map((t, i) => (
                <li key={i}>
                  {`${t.tipo[0].toUpperCase()}-${t.numero}`} ({t.tipo})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DisplayScreen;
