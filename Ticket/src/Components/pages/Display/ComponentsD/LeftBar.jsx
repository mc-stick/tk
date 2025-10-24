import React, { useEffect, useState, useRef } from "react";
import "./LeftBar.css";
import { FaBell } from "react-icons/fa6";
import logo from "../../../../assets/sound/dingdong.mp3"

const LeftBar = ({ data }) => {
  const [ultimoAnimado, setUltimoAnimado] = useState(null);
  const [mostrarAnimacion, setMostrarAnimacion] = useState(false);
  const prevTurnosRef = useRef([]);

  // 📌 Referencia al audio
  const audioRef = useRef(null); // 👉 AÑADIDO

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
    (t) => t.estado === "atendiendo" && t.isactive
  );

  useEffect(() => {
    const prevIds = prevTurnosRef.current.map((t) => t.id);
    const nuevosTurnos = turnosVisibles.filter((t) => !prevIds.includes(t.id));

    if (nuevosTurnos.length > 0) {
      const nuevoTurno = nuevosTurnos[0]; // Solo el primero nuevo
      if (nuevoTurno) {
        setUltimoAnimado(nuevoTurno.id);
        setMostrarAnimacion(true);

        // 📌 Reproducir sonido si hay animación
        if (audioRef.current) {
          audioRef.current.currentTime = 0; // Reiniciar audio
          audioRef.current
            .play()
            .catch((err) => console.error("Error al reproducir audio:", err));
        }

        setTimeout(() => setMostrarAnimacion(false), 3000);
      }

      prevTurnosRef.current = turnosVisibles;
    }
  }, [turnosVisibles]);

  return (
    <>
      {/* 📌 Elemento de audio oculto */}
      <audio ref={audioRef} src={logo} preload="auto" /> {/* 👉 AÑADIDO */}

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
                {/* <FaBell color="orange" size={42} /> */}
                {t.puesto ? `${t.numero} - Puesto ${t.puesto}` : "En espera."}
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
