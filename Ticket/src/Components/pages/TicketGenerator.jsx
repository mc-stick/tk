import { useState } from "react";
import { useTurno } from "../context/TurnoContext";
import "./TicketGenerator.css";
import AnimatedButton from "../Buttons/animatedBtn";

const opciones = [
  { tipo: "Caja", icono: "💰" },
  { tipo: "Servicios", icono: "🛎️" },
  { tipo: "Informes", icono: "📄" },
];

const TicketGenerator = () => {
  const { generarTurno } = useTurno();
  const [estado, setEstado] = useState("inicio"); // inicio | seleccion | confirmado
  const [turno, setTurno] = useState(null);

  const comenzar = () => {
    setEstado("seleccion");
    setTurno(null);
  };

  const seleccionarServicio = (tipo) => {
    const nuevo = generarTurno(tipo);
    setTurno(nuevo);
    setEstado("confirmado");
  };

  const aceptar = () => {
    setEstado("inicio");
    setTurno(null);
  };

  return (
    <div className="cliente-container">
      <div className="background-image" />
      {estado === "inicio" && (
        <AnimatedButton icon="🟢" label="Comenzar" onClick={comenzar} />
      )}

      {estado === "seleccion" && (
        <>
          <h1>Seleccione el servicio</h1>
          <div className="botones">
            {opciones.map(({ tipo, icono }) => (
              <AnimatedButton
                icon={icono}
                label={tipo}
                onClick={() => seleccionarServicio(tipo)}
              />
            ))}
          </div>
        </>
      )}

      {estado === "confirmado" && turno && (
        <div className="modal">
          <div className="modal-content">
            <h2>🎟️ Tu turno ha sido generado</h2>
            <p className="turno">
              <strong>
                {turno.tipo[0]}-{turno.numero}
              </strong>
            </p>
            <p>
              Dirección: <strong>{turno.tipo}</strong>
            </p>
            <button className="aceptar-btn" onClick={aceptar}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketGenerator;
