import React, { useEffect, useState, useRef } from "react";
import "./LeftBar.css";
import dingSound from "../../../../assets/sound/dingdong.mp3";

const LeftBar = ({ data }) => {
  const [nuevoTurno, setNuevoTurno] = useState(null);
  const prevTurnosRef = useRef([]);
  const audioRef = useRef(null);

  const [view, setView] = useState(false);

  // Obtener turnos actualmente "Atendiendo"
  const turnosVisibles =
    data?.totalatend?.filter((t) => t.status_name === "Atendiendo") || [];

  // Detectar nuevo turno
  useEffect(() => {
    setView(false)
    const prevIds = prevTurnosRef.current.map((t) => t.id);
    const nuevos = turnosVisibles.filter((t) => !prevIds.includes(t.id));

    if (nuevos.length > 0) {
      const turno = nuevos[0];

      // 🔁 Reiniciar el estado para forzar animación
      setNuevoTurno(null);
      setTimeout(() => {
        setNuevoTurno(turno.id);

        // 🎵 Reproducir sonido
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current
            .play()
            .catch((err) => console.warn("No se pudo reproducir audio:", err));
        }

        // ⏱️ Quitar animación luego de 3s
        setTimeout(() => setNuevoTurno(null), 3000);
      }, 1000);
    }
    setView(true)
    prevTurnosRef.current = turnosVisibles;
  }, [turnosVisibles]);

  if (turnosVisibles.length === 0) return null;

  return (
    <>
      {view ? (
        <div className="leftbar-container">
          <audio ref={audioRef} src={dingSound} preload="auto" />
          <h2 className="leftbar-title"> ATENDIENDO</h2>
          <div className="leftbar-title-list">
            <span className="leftbar-ticket">Turno</span>
            <span className="leftbar-puesto">Puesto</span>
          </div>

          <ul className="leftbar-list">
            {turnosVisibles.slice(0, 8).map((t) => (
              <li
                key={`${t.ticket_id}-${nuevoTurno === t.id ? Date.now() : ""}`}
                className={`leftbar-item ${
                  nuevoTurno === t.id ? "leftbar-item-active" : ""
                }`}>
                <span className="leftbar-ticket">{t.nticket}</span>
                <span className="leftbar-puesto"><strong>{t.puesto_name}</strong></span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default LeftBar;
