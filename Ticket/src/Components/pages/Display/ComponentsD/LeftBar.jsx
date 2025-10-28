import React, { useEffect, useState, useRef } from "react";
import "./LeftBar.css";
import dingSound from "../../../../assets/sound/dingdong.mp3";

const LeftBar = ({ data }) => {
  const [nuevoTurno, setNuevoTurno] = useState(null);
  const prevTurnosRef = useRef([]);
  const audioRef = useRef(null);

  // Obtener turnos actualmente "Atendiendo"
  const turnosVisibles = data?.totalatend?.filter((t) => t.status_name === "Atendiendo") || [];

  // Detectar nuevo turno
  useEffect(() => {
    const prevIds = prevTurnosRef.current.map((t) => t.id);
    const nuevos = turnosVisibles.filter((t) => !prevIds.includes(t.id));

    if (nuevos.length > 0) {
      const turno = nuevos[0];
      setNuevoTurno(turno.id);

      // reproducir sonido
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .catch((err) => console.warn("No se pudo reproducir audio:", err));
      }

      // quitar animación luego de 3s
      setTimeout(() => setNuevoTurno(null), 3000);
    }

    prevTurnosRef.current = turnosVisibles;
  }, [turnosVisibles]);

  if (turnosVisibles.length === 0) return null;

  return (
    <div className="leftbar-container">
      <audio ref={audioRef} src={dingSound} preload="auto" />
      <h2 className="leftbar-title"> ATENDIENDO</h2>

      <ul className="leftbar-list">
        {turnosVisibles.slice(0, 8).map((t) => (
          <li
            key={t.ticket_id}
            className={`leftbar-item ${
              nuevoTurno === t.id ? "leftbar-item-active" : ""
            }`}>
            <span className="leftbar-ticket">{t.ticket_id}</span>
            <span className="leftbar-puesto">{t.puesto_name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftBar;
