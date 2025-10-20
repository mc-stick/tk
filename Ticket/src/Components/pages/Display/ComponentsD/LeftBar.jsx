import React, { useEffect, useState, useRef } from "react";
import "./LeftBar.css";
import { FaBell } from "react-icons/fa6";

const LeftBar = ({ data }) => {
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

  // Filtrar los que se mostrarán
  const turnosVisibles = turnosTotales.filter((t) => t.estado !== "t");

  useEffect(() => {
    const prevIds = prevTurnosRef.current.map((t) => t.id);
    const nuevosTurnos = turnosVisibles.filter((t) => !prevIds.includes(t.id));

    if (nuevosTurnos.length > 0) {
      const nuevoTurno = nuevosTurnos[0]; // Solo el primero nuevo
      if (nuevoTurno) {
        setUltimoAnimado(nuevoTurno.id);
        setMostrarAnimacion(true);
        setTimeout(() => setMostrarAnimacion(false), 3000);
      }

      // Actualizar referencia
      prevTurnosRef.current = turnosVisibles;
    }
    console.log(turnosTotales);
  }, [turnosVisibles]);

  return (
    <>
      {turnosVisibles.length > 0 && (
        <div className="turno-panels1">
          <br />
          <h1 className="turno-title1">ATENDIENDO</h1>

          <ul className="turno-lista-scroll1">
            {turnosVisibles.slice(0, 10).map((t, i) => (
              <li
                key={t.id ?? i}
                className={`turno-item1 ${
                  t.id === ultimoAnimado && mostrarAnimacion ? "alerta" : ""
                }`}
              >
                <FaBell color="orange" size={42} />
                {t.puesto ? ` # ${t.id} - Caja ${t.estado}` : "En espera."}
              </li>
            ))}
          </ul>



          {/* SOLO PARA MOSTRAR LA LISTA DE ESPERA COMPLETA. */}

          {/* <h1 className="turno-title1">EN ESPERA</h1>

          <ul className="turno-lista-scroll1">
            {turnosTotales.slice(1, 10).map((t, i) => (
              <li
                key={t.id ?? i}
                className={`turno-item1 ${
                  t.id === ultimoAnimado && mostrarAnimacion ? "alerta" : ""
                }`}
              >
                <FaBell color="orange" size={42} />
                {t.puesto ? ` ${t.id} Caja ${t.estado}` : "En espera."}
              </li>
            ))}
          </ul> */}
        </div>
      )}
    </>
  );
};

export default LeftBar;
