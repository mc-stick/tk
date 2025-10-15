import { useState } from "react";
import { useTurno } from "../context/TurnoContext";
import "./TicketGenerator.css";
import '../../index.css'
import AnimatedButton from "../Buttons/animatedBtn";
import { FcBusinessContact, FcCellPhone, FcCurrencyExchange, FcInfo, FcReadingEbook } from "react-icons/fc";
import { FaCircleUser, FaIdCard } from "react-icons/fa6";
import { FaIdCardAlt, FaPhone } from "react-icons/fa";
import FormattedInput  from "../Inputs/Input";
import '../Inputs/input.css'



const Servicios = [
  { tipo: "Caja", icono: <FcCurrencyExchange/> },
  { tipo: "Servicios", icono: <FcReadingEbook/> },
  { tipo: "Informes", icono: <FcInfo/> },
];
const Identify = [
  { label:'Cédula', tipo: "cedula", icono: <FaIdCard />, lengt_str: 11 },
  { label:'Matrícula', tipo: "matricula", icono: <FaIdCardAlt/>, lengt_str: 8 },
  { label:'Teléfono', tipo: "telefono", icono: <FaPhone/>, lengt_str: 10},
];

const TicketGenerator = () => {
  const { generarTurno } = useTurno();
  const [estado, setEstado] = useState("inicio"); // inicio | seleccion | confirmado
  const [val, setVal]=useState(''); // valor devuelto del componente cedula o matr
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

    const seleccionarId = (tipo, label,lengt_str) => {
      console.log(tipo, label)
      setEstado(["started", tipo, label, lengt_str]);
     };

  const aceptar = () => {
    setEstado("inicio");
    setTurno(null);
  };



  return (
    <div className="cliente-container input-page-container_index">
       <div className="overlay" />
      {estado === "inicio" && (
        <AnimatedButton icon="🟢" label="Comenzar" onClick={comenzar} />
      )}

      {estado === "seleccion" && (
        <div className="formattedInputContainer">
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
        </div>
      )}


      {estado === "Identificador" && (
        <div className="formattedInputContainer">
          <h1>Seleciona un metodo de identificación</h1>
          <div className="botones">
            {Identify.map(({ tipo, icono, label,lengt_str }) => (
              <AnimatedButton
                key={label}
                icon={icono}
                label={label}
                onClick={() => seleccionarId(tipo,label,lengt_str)}
              />
            ))}
          </div>
        </div>
      )}

       {estado[0] === "started" && (
        <>
        {/* <InputCard label='Input' btnlabel='Aceptar' tipo='telefono' onClick={()=>aceptar()}/> */}
        <FormattedInput tipo={estado[1]} setEstado={setEstado} setVal={setVal} label={estado[2]} lengt_str={estado[3]}/>
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
