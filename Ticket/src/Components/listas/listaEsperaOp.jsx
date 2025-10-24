import React, { useEffect, useState, useRef } from "react";
import "./OpListEspera.css";
import { FaBell } from "react-icons/fa6";
import { FaExclamation } from "react-icons/fa";

const OpListEspera = ({ data, onLlamarTurno, btn, user }) => {
  const [ultimoAnimado, setUltimoAnimado] = useState(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const prevTurnosRef = useRef([]);

  // Construir lista de turnos

  const turnosTotales = [];
  const atender = [];

  if (data.turnoActual) {
    turnosTotales.push(data.turnoActual);
    turnosTotales[0].map((t) => atender.push(t));
  }

  if (data.cola && data.cola.length > 0) {
    turnosTotales.push(...data.cola);
  }

  // Filtrar los turnos a mostrar
  const turnosVisibles = atender.filter(
    (t) =>
      t.estado === "atendiendo" && t.isactive && t.puesto === data.user.username
  );

  // Filtrar solo turnos con estado "espera"
  const turnosEnEspera = turnosTotales.filter(
    (t) => t.estado === "espera" && t.isactive === 1
  );

  useEffect(() => {
    const prevIds = prevTurnosRef.current.map((t) => t.id);
    const nuevosTurnos = turnosEnEspera.filter((t) => !prevIds.includes(t.id));

    if (nuevosTurnos.length > 0) {
      const nuevoTurno = nuevosTurnos[0];
      if (nuevoTurno) {
        setUltimoAnimado(nuevoTurno.id);
        setMostrarAnimacion(true);
        setTimeout(() => setMostrarAnimacion(false), 3000);
      }
      prevTurnosRef.current = turnosEnEspera;
    }
  }, [turnosEnEspera]);

  const handleLlamar = (turno) => {
    if (onLlamarTurno) {
      onLlamarTurno(turno);
    }
  };

  return (
    <>
      {turnosVisibles.length > 0 && turnosEnEspera.length == 0 && (
        <ul className="turno-lista-scroll1">
          {/* <p> {btn}</p> */}
          <span>Cuando finalice el turno presiona el boton <strong>"ATENDIDO"</strong> .</span>
          {turnosVisibles.map((t, i) => (
            <li
              key={t.id ?? i}
              className={`turno-itemFinal ${
                t.id === ultimoAnimado && mostrarAnimacion ? "alerta" : ""
              }`}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <span>
                  {/* <FaExclamation color="red" size={42} style={{ marginRight: "6px" }} /> */}
                  {t.puesto
                    ? ` #${t.id} - (${t.tipo})`
                    : `#${t.id} - ${t.tipo}`}
                </span>
                <button className="btn-llamar" onClick={() => handleLlamar(t)}>
                  Atendido
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {turnosEnEspera.length > 0 ? (
        <ul className="turno-lista-scroll1">
          {/* <p> {btn}</p> */}

          {turnosEnEspera.map((t, i) => (
            <li
              key={t.id ?? i}
              className={`turno-item1 ${
                t.id === ultimoAnimado && mostrarAnimacion ? "alerta" : ""
              }`}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <span>
                  {/* <FaBell color="orange" size={18} style={{ marginRight: "6px" }} /> */}
                  {t.puesto
                    ? ` #${t.id} - (${t.tipo})`
                    : `#${t.id} - ${t.tipo}`}
                </span>
                <button className="btn-llamar" onClick={() => handleLlamar(t)}>
                  Atender
                </button>
              </div>
            </li>
            
          ))}
        </ul>
      ) : (
        <> <hr />
          
         
          <span><strong>No hay turnos en espera.</strong></span>
        </>
      )}
    </>
  );
};

export default OpListEspera;
