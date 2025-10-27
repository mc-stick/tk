import React, { useEffect, useState, useRef } from "react";
import "./OpListEspera.css";
import { FaBell } from "react-icons/fa6";
import { FaExclamation } from "react-icons/fa";

const OpListEspera = ({ data, onLlamarTurno, btn }) => {
  const [ultimoAnimado, setUltimoAnimado] = useState(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const prevTurnosRef = useRef([]);
  const [prevTurno, setPrevTurno] = useState("");

  // Construir lista de turnos

  // console.log(data);
  const turnosTotales = [];
  const atender = [];

  if (data.turnoActual) {
    turnosTotales.push(data.turnoActual);
    turnosTotales.map((t) => atender.push(t));
  }

  if (data.cola && data.cola.length > 0) {
    // console.log(data.cola);
    if (data.cola.status_name != "En espera") turnosTotales.push(...data.cola);
  }
  //console.log(turnosTotales);

  // Filtrar los turnos a mostrar
  const turnosVisibles = atender.filter(
    (t) =>
      //console.log(t.status_name, t.assigned_employee, data.user.full_name, atender, turnosTotales)
      t.status_name === "Atendiendo" &&
      t.assigned_employee === data.user.full_name
  );

  // console.log(atender);

  // Filtrar solo turnos con estado "espera"
  const turnosEnEspera = turnosTotales.filter(
    (t) => t.status_name === "En espera"
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

  const handleLlamar = (turno, atender) => {
    let puesto2;
    //console.log(turno)
    if(prevTurno===""){
      console.log('nulo', prevTurno)
      setPrevTurno(turno)
    }else{
      setPrevTurno(turno)
      console.log('de lo contrario', prevTurno)
      puesto2 = {
        ...prevTurno,
        puesto_name: data.user.puesto_name,
        assigned_employee: data.user.employee_id,
        status_id: 3
      };
      onLlamarTurno(puesto2);
    }

    if (atender) {
      puesto2 = {
        ...turno,
        puesto_name: data.user.puesto_name,
        assigned_employee:data.user.employee_id,
        status_id: 2
      };
      
    } else {
      puesto2 = {
        ...turno,
        puesto_name: data.user.puesto_name,
        assigned_employee: data.user.employee_id,
        status_id: 3
      };
    }

    if (onLlamarTurno) {
      //console.log("handle llaamr", puesto2);
      onLlamarTurno(puesto2);
    }
  };

  //console.log("turnos visibles", turnosVisibles);
  //turnosEnEspera.map((t, i) => (console.log('espera',t)))

  return (
    <>
      {/* {turnosVisibles.length > 0 && turnosEnEspera.length <= 1 &&  ( */}
      {turnosVisibles.length > 0 &&   (
        <>
          <ul className="turno-lista-scroll1">
            {/* <p> {btn}</p> */}
            <span>
              Cuando finalice el turno presiona el boton{" "}
              <strong>"ATENDIDO"</strong> .
            </span>
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
                    {t.ticket_id
                      ? ` #${t.ticket_id} - (${t.service_name}) `
                      : `#${t.id} - ${t.tipo}`}
                  </span>
                  <button
                    style={{
                      backgroundColor: "green",
                      border: "1px solid white",
                    }}
                    className="btn-llamar"
                    onClick={() => handleLlamar(t, false)}>
                    Atendido
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <hr />
        </>
      )}

      {turnosEnEspera.length > 0 ? (
        <ul className="turno-lista-scroll1">
          {/* <p> {btn}</p> */}
          <span>
            Turnos<strong> en espera</strong> .
          </span>
          {turnosEnEspera.reverse().map((t, i) => (
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
                  {t.ticket_id
                    ? ` #${t.ticket_id} - (${t.service_name})`
                    : `#${t.id} - ${t.tipo}`}
                </span>
                <button
                  style={{ border: "1px solid white" }}
                  className="btn-llamar"
                  onClick={() => handleLlamar(t, true)}>
                  Atender
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <span>
            <strong>No hay turnos en espera.</strong>
          </span>
        </>
      )}
    </>
  );
};

export default OpListEspera;
