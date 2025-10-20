import React, { useEffect, useState, useRef } from "react";
import "./OpListEspera.css";
import { FaBell } from "react-icons/fa6";

const OpListEspera = ({ data, onLlamarTurno }) => {
  const [ultimoAnimado, setUltimoAnimado] = useState(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const prevTurnosRef = useRef([]);

  const turnosTotales = [];

  if (data.turnoActual) {
    turnosTotales.push(data.turnoActual);
  }

  if (data.cola && data.cola.length > 0) {
    turnosTotales.push(...data.cola);
  }

  useEffect(() => {
    const prevIds = prevTurnosRef.current.map((t) => t.id);
    const nuevosTurnos = turnosTotales.filter((t) => !prevIds.includes(t.id));

    if (nuevosTurnos.length > 0) {
      const nuevoTurno = nuevosTurnos[0]; // Solo el primero nuevo
      if (nuevoTurno) {
        setUltimoAnimado(nuevoTurno.id);
        setMostrarAnimacion(true);
        setTimeout(() => setMostrarAnimacion(false), 3000);
      }

      // Actualizar referencia
      prevTurnosRef.current = turnosTotales;
    }
  }, [turnosTotales]);

  const handleLlamar = (turno) => {
    if (onLlamarTurno) {
      onLlamarTurno(turno);
    }
  };

  return (
    <>
      {turnosTotales.length > 0 && (
        
          

          <ul className="turno-lista-scroll1">
            {turnosTotales.slice(0, 10).map((t, i) => (
              <li
                key={t.id ?? i}
                className={`turno-item1 ${t.id === ultimoAnimado && mostrarAnimacion ? "alerta" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span>
                    
                    {t.puesto ? ` #${t.id} - (${t.numero})` : `# ${t.id} - ${t.estado}`}
                  </span>
                  <button className="btn-llamar" onClick={() => handleLlamar(t)}>
                    Llamar
                  </button>
                </div>
              </li>
            ))}
          </ul>
    
      )}
    </>
  );
};

export default OpListEspera;
