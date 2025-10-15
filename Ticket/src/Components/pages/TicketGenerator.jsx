import { useState } from "react";
import { useTurno } from "../context/TurnoContext";
import "./TicketGenerator.css";
import AnimatedButton from "../Buttons/animatedBtn";
import { FcBusinessContact, FcCellPhone, FcCurrencyExchange } from "react-icons/fc";
import { FaCircleUser, FaIdCard } from "react-icons/fa6";
import { InputCard } from "../Inputs/Input";



const Servicios = [
  { tipo: "Caja", icono: <FcCurrencyExchange/> },
  { tipo: "Servicios", icono: "🛎️" },
  { tipo: "Informes", icono: "📄" },
];
const Identify = [
  { tipo: "Cedula", icono: <FaIdCard color="yellow"/> },
  { tipo: "Matrícula", icono: <FcBusinessContact/> },
  { tipo: "Numero de teléfono", icono: <FcCellPhone/>},
];

const TicketGenerator = () => {
  const { generarTurno } = useTurno();
  const [estado, setEstado] = useState("inicio"); // inicio | seleccion | confirmado
  const [turno, setTurno] = useState(null);

  const comenzar = () => {
    setEstado("Identificador");
    setTurno(null);
  };

  const seleccionarServicio = (tipo) => {
    const nuevo = generarTurno(tipo);
    setTurno(nuevo);
    setEstado("confirmado");
  };

    const seleccionarId = (tipo) => {
      console.log(tipo)
      setEstado("started");
    return(
      <>
      
      </>
    )

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
            {Servicios.map(({ tipo, icono }) => (
              <AnimatedButton
                icon={icono}
                label={tipo}
                onClick={() => seleccionarServicio(tipo)}
              />
            ))}
          </div>
        </>
      )}


      {estado === "Identificador" && (
        <>
          <h1>Seleciona un metodo de identificación</h1>
          <div className="botones">
            {Identify.map(({ tipo, icono }) => (
              <AnimatedButton
                icon={icono}
                label={tipo}
                onClick={() => seleccionarId(tipo)}
              />
            ))}
          </div>
        </>
      )}

       {estado === "started" && (
        <>
        <InputCard label='Input' btnlabel='Aceptar' tipo='telefono' onClick={()=>aceptar()}/>
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
