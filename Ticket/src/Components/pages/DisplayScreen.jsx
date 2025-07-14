import { useTurno } from "../context/TurnoContext";
import { useEffect, useState } from "react";
import "./DisplayScreen.css";

const DisplayScreen = () => {
  const { turnoActual, cola } = useTurno();
  const [imagenes, setImagenes] = useState([]);
  const [actual, setActual] = useState(0);

  // Cargar imágenes desde localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("imagenes")) || [];
    setImagenes(data);
  }, []);

  // Cambiar imagen cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActual((prev) => (imagenes.length ? (prev + 1) % imagenes.length : 0));
    }, 10000);
    return () => clearInterval(interval);
  }, [imagenes]);

  return (
    <div className="pantalla">
      {(turnoActual || cola.length > 0) && (
        <div className="turno-panel">
          <h1>Turno Siguiente</h1>
          <div className="turno-num">
            {turnoActual
              ? `${turnoActual.tipo[0].toUpperCase()}-${turnoActual.numero}`
              : "—"}
          </div>

          <div className="proximos">
            <h2>Turnos en espera:</h2>
            <ul>
              {cola.slice(0, 10).map((t, i) => (
                <li key={i}>
                  {`${t.tipo[0].toUpperCase()}-${t.numero}`} ({t.tipo})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="imagen-panel">
        {imagenes.length > 0 ? (
          <img src={imagenes[actual]} alt={`img-${actual}`} />
        ) : (
          <p style={{ color: "#ccc" }}>Sin imágenes disponibles</p>
        )}
      </div>
    </div>
  );
};

export default DisplayScreen;
