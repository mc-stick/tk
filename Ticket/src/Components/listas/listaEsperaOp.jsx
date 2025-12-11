import React, { useEffect, useState, useRef } from "react";
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
    <div className="p-6 space-y-6 bg-gray-50 rounded-xl shadow-lg">
      {turnosVisibles.length > 0 && (
        <section>
          <h3 className="text-2xl font-semibold text-green-700 flex  items-center mb-4">
            <FaCheckCircle className="mr-3 text-xl" /> Turno actual
          </h3>
          <p className="text-gray-600 mb-4">
            Cuando finalices el turno, presiona el botón{" "}
            <strong>"ATENDIDO"</strong>.
          </p>
          <ul className="space-y-4">
            {turnosVisibles.map((t, i) => (
              <li
                key={t.id ?? i}
                className={`p-4 bg-gray-300 rounded-lg shadow-lg flex justify-between items-center transition-all duration-300 ease-in-out transform ${
                  t.id === ultimoAnimado && mostrarAnimacion ? "bg-yellow-100" : ""
                }`}
              >
                <span className="text-sm text-gray-800 font-medium">
                  #{t.nticket ?? t.id} - {t.service_name ?? t.tipo}
                </span>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  onClick={() => handleLlamar(t, false)}
                >
                  Atendido
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <hr className="border-gray-300 my-6" />

      <section>
        <h3 className="text-2xl font-semibold text-blue-600 flex items-center mb-4">
          <FaBell className="mr-3 text-xl" /> Turnos en espera
        </h3>
        {turnosEnEspera.length > 0 ? (
          <ul className="space-y-4">
            {turnosEnEspera.reverse().map((t, i) => (
              <li
                key={t.id ?? i}
                className={`p-4 bg-gray-300 rounded-lg shadow-lg flex justify-between items-center transition-all duration-300 ease-in-out transform ${
                  t.id === ultimoAnimado && mostrarAnimacion ? "bg-yellow-100" : ""
                }`}
              >
                <span className="text-sm text-gray-800 font-medium">
                  #{t.nticket ?? t.id} - {t.service_name ?? t.tipo}
                </span>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  onClick={() => handleLlamar(t, true)}
                >
                  Atender
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center text-red-500 mt-4">
            <FaExclamationCircle size={20} className="mr-2" />
            <span>No hay turnos en espera</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default OpListEspera;
