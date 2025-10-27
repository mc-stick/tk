import { useState, useEffect } from "react";
import { useTurno } from "../context/TurnoContext";
import "./TicketGenerator.css";
import "../../index.css";
import AnimatedButton from "../Buttons/animatedBtn";
import {
  FcBusinessContact,
  FcCellPhone,
  FcCurrencyExchange,
  FcInfo,
  FcReadingEbook,
} from "react-icons/fc";
import { FaIdCard, FaIdCardAlt, FaPhone, FaTicketAlt } from "react-icons/fa";
import FormattedInput from "../Inputs/Input";
import "../Inputs/input.css";
import ImgCustoms from "../widgets/ImgCustoms";
import ImgLogo from "../../assets/img/UcneLogoIcon.png";

const TicketGenerator = () => {
  const { generarTurno } = useTurno();
  const [estado, setEstado] = useState("inicio"); // inicio | seleccion | confirmado
  const [val, setVal] = useState(""); // valor devuelto del componente cedula o matr
  const [turno, setTurno] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [identificaciones, setIdentificaciones] = useState([]);

  // === Cargar datos desde la DB ===
  const fetchServicios = async () => {
    try {
      const res = await fetch("http://localhost:4001/api/services");
      if (!res.ok) throw new Error("Error al cargar servicios");
      const data = await res.json();
      setServicios(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIdentificaciones = async () => {
    try {
      const res = await fetch("http://localhost:4001/api/docs");
      if (!res.ok) throw new Error("Error al cargar identificaciones");
      const data = await res.json();
      setIdentificaciones(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServicios();
    fetchIdentificaciones();
  }, []);

  // === Funciones del flujo ===
  const comenzar = () => {
    setEstado("Identificador");
    setTurno(null);
  };

  const seleccionarServicio = (tipo) => {
    // console.log("numero tipo",tipo, val);
    const nuevo = generarTurno(tipo, val);
    
    setTurno(nuevo);
    setEstado("confirmado");
  };

  const seleccionarId = (tipo, label, size) => {
    setEstado(["started", tipo, label, size]);
  };

  const aceptar = () => {
    setEstado("inicio");
    setTurno(null);
  };

  // === Mapeo dinámico de íconos según tipo ===
  const iconoServicio = (tipo) => {
    switch (tipo) {
      case "Caja":
        return <FcCurrencyExchange />;
      case "Servicios":
        return <FcReadingEbook />;
      case "Informes":
        return <FcInfo />;
      default:
        return <FcBusinessContact />;
    }
  };

  // console.log("turnooo",turno);

  return (
    <div className="cliente-container input-page-container_index">
      <div className="overlay" />

      {estado === "inicio" && (
        <AnimatedButton
          style={{ justifyContent: "center" }}
          icon={
            <ImgCustoms style={{ margin: "30px" }} src={ImgLogo} width="90px" />
          }
          label="Comenzar"
          onClick={comenzar}
        />
      )}

      {estado === "Identificador" && (
        <div className="formattedInputContainer">
          <h1>Selecciona un método de identificación</h1>
          <div className="botones">
            {identificaciones.map(({ tipo, name, size }) => (
              <AnimatedButton
                key={name}
                icon={<FaIdCard />}
                label={name}
                onClick={() => seleccionarId(tipo, name, size)}
              />
            ))}
          </div>
        </div>
      )}
      
      {estado[0] === "started" && (
        <FormattedInput
          tipo={estado[1]}
          setEstado={setEstado}
          setVal={setVal}
          label={estado[2]}
          size={estado[3]}
        />
      )}

      {estado === "seleccion" && (
        <div className="formattedInputContainer">
          <h1>Seleccione el servicio</h1>
          <div className="botones">
            {servicios.map(({ service_id, name }) => (
              <AnimatedButton
                key={service_id}
                icon={iconoServicio(name)}
                label={name}
                onClick={() => seleccionarServicio(service_id)}
              />
            ))}
          </div>
        </div>
      )}


      {estado === "confirmado" && turno && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tu turno se ha generado</h2>
            <p>
              <FaTicketAlt
                style={{ margin: "-20px", fontSize: 40, color: "green" }}
              />
            </p>
            <p className="turno">
              <strong>
                {turno && turno.tipo
                  ? `${turno.tipo[0]}-${turno.numero}`
                  : "Ningún turno"}
              </strong>
            </p>
            <p>
              Dirección:{" "}
              <strong>
                {turno.tipo} valor{val}
              </strong>
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
