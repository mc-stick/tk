import React from "react";
import "./LeftBar.css"
const LeftBar = ({ data }) => {
  const turnosTotales = [];

  // Agrega el turno actual al principio de la lista, si existe
  if (data.turnoActual) {
    turnosTotales.push(data.turnoActual);
  }

  // Agrega los turnos en espera (cola)
  if (data.cola && data.cola.length > 0) {
    turnosTotales.push(...data.cola);
  }

  return (
    <>
      {turnosTotales.length > 0 && (
        <div className="turno-panels1">
          <br />
          <h1 className="turno-title1">ATENDIENDO</h1>

          <ul className="turno-lista-scroll1">
            {turnosTotales.slice(0, 10).map((t, i) => (
              <li key={i} className="turno-item1">
                {`${t.tipo[0].toUpperCase()}-${t.numero}`} &gt;{" "}
                {t.puesto ? `Caja ${t.puesto}` : "En espera."}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default LeftBar;
