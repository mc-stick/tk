import React, { useEffect, useState, useRef } from "react";
import "./OpListEspera.css";
import { FaBell, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const OpListEspera = ({ data, onLlamarTurno }) => {
  const [ultimoAnimado, setUltimoAnimado] = useState(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const prevTurnosRef = useRef([]);
  const [prevTurno, setPrevTurno] = useState("");

  const turnosTotales = [];
  const atender = [];

  if (data.turnoActual) {
    turnosTotales.push(data.turnoActual);
    turnosTotales.map((t) => atender.push(t));
  }

  if (data.cola && data.cola.length > 0) {
    if (data.cola.status_name !== "En espera") turnosTotales.push(...data.cola);
  }

  const turnosVisibles = atender.filter(
    (t) =>
      t.status_name === "Atendiendo" &&
      t.assigned_employee === data.user.full_name
  );

  const turnosEnEspera = turnosTotales.filter(
    (t) => t.status_name === "En espera"
  );

  useEffect(() => {
    const prevIds = prevTurnosRef.current.map((t) => t.id);
    const nuevosTurnos = turnosEnEspera.filter((t) => !prevIds.includes(t.id));

    if (nuevosTurnos.length > 0) {
      const nuevoTurno = nuevosTurnos[0];
      setUltimoAnimado(nuevoTurno.id);
      setMostrarAnimacion(true);
      setTimeout(() => setMostrarAnimacion(false), 3000);
      prevTurnosRef.current = turnosEnEspera;
    }
  }, [turnosEnEspera]);

  const handleLlamar = (turno, atender) => {
    let puesto2;
    if (prevTurno === "") {
      setPrevTurno(turno);
    } else {
      setPrevTurno(turno);
      puesto2 = {
        ...prevTurno,
        puesto_name: data.user.puesto_name,
        assigned_employee: data.user.employee_id,
        status_id: 3,
      };
      onLlamarTurno(puesto2);
    }

    if (atender) {
      puesto2 = {
        ...turno,
        puesto_name: data.user.puesto_name,
        assigned_employee: data.user.employee_id,
        status_id: 2,
      };
    } else {
      puesto2 = {
        ...turno,
        puesto_name: data.user.puesto_name,
        assigned_employee: data.user.employee_id,
        status_id: 3,
      };
    }

    if (onLlamarTurno) {
      onLlamarTurno(puesto2);
    }
  };

  return (
    <div className="oplist-container">
      {turnosVisibles.length > 0 && (
        <section className="turno-section">
          <h3 className="turno-title attending">
            <FaCheckCircle className="icon" /> Turno actual
          </h3>
          <p className="turno-description">
            Cuando finalices el turno, presiona el botón{" "}
            <strong>"ATENDIDO"</strong>.
          </p>
          <ul className="turno-lista">
            {turnosVisibles.map((t, i) => (
              <li
                key={t.id ?? i}
                className={`turno-card active ${
                  t.id === ultimoAnimado && mostrarAnimacion ? "alerta" : ""
                }`}
              >
                <span className="turno-info">
                  #{t.nticket ?? t.id} - {t.service_name ?? t.tipo}
                </span>
                <button
                  className="btn-turno success"
                  onClick={() => handleLlamar(t, false)}
                >
                  Atendido
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <hr className="turno-divider" />

      <section className="turno-section">
        <h3 className="turno-title waiting">
          <FaBell className="icon" /> Turnos en espera
        </h3>
        {turnosEnEspera.length > 0 ? (
          <ul className="turno-lista">
            {turnosEnEspera.reverse().map((t, i) => (
              <li
                key={t.id ?? i}
                className={`turno-card ${
                  t.id === ultimoAnimado && mostrarAnimacion ? "alerta" : ""
                }`}
              >
                <span className="turno-info">
                  #{t.nticket ?? t.id} - {t.service_name ?? t.tipo}
                </span>
                <button
                  className="btn-turno primary"
                  onClick={() => handleLlamar(t, true)}
                >
                  Atender
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-turnos">
            <FaExclamationCircle size={20} />{" "}
            <span>No hay turnos en espera</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default OpListEspera;
