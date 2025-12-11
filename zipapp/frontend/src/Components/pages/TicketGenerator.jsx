import { useState, useEffect, useRef } from "react";
import { useTurno } from "../context/TurnoContext";
import "./TicketGenerator.css";
import "./ticketgeneServ.css";
import "../../index.css";
import AnimatedButton from "../Buttons/animatedBtn";
import {
  FcBusinessContact,
  FcCurrencyExchange,
  FcInfo,
  FcReadingEbook,
} from "react-icons/fc";
import { FaIdCard } from "react-icons/fa";
import FormattedInput from "../Inputs/Input";
import "../Inputs/input.css";
import ImgCustoms from "../widgets/ImgCustoms";
import ImgLogo from "../../assets/img/UcneLogoIcon.png";
import { SendTwilioSms } from "../twilio/TwMsg";
import Modal from "../Buttons/Modal";
import handleFullscreen from "../Buttons/FullScreenbtn";
import { FaTicket } from "react-icons/fa6";

const services = import.meta.env.VITE_SERVICE_API;

const TicketGenerator = () => {
  const { generarTurno } = useTurno();

  const [estado, setEstado] = useState("inicio");
  const [val, setVal] = useState("");
  const [turno, setTurno] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [identificaciones, setIdentificaciones] = useState([]);

  const [open, setOpen] = useState(false);

  const timerRef = useRef(null);

  // --- 🔹 Detección de inactividad ---
  useEffect(() => {
    const resetInactivity = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (estado !== "inicio") {
        timerRef.current = setTimeout(() => {
          setEstado("inicio");
          setTurno(null);
          setVal("");
        }, 600000); // 1 minuto = 60,000 ms
      }
    };

    // Eventos que cuentan como actividad del usuario
    const eventos = ["mousemove", "mousedown", "keydown", "touchstart"];
    eventos.forEach((ev) => window.addEventListener(ev, resetInactivity));

    // Configura el temporizador inicial
    resetInactivity();

    return () => {
      eventos.forEach((ev) => window.removeEventListener(ev, resetInactivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [estado]);

  //console.log(services);

  // --- Cargar datos iniciales ---
  const fetchData = async () => {
    try {
      const [servRes, idRes] = await Promise.all([
        fetch(`${services}/services`),
        fetch(`${services}/docs`),
      ]);

      if (!servRes.ok || !idRes.ok) throw new Error("Error al cargar datos");

      const [servData, idData] = await Promise.all([
        servRes.json(),
        idRes.json(),
      ]);
      //console.log("service data", servData);

      const servActive = servData.filter((item) => item.is_active === 1);

      setServicios(servActive);
      setIdentificaciones(idData);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };
  useEffect(() => {
    document.title = "UCNE | Cliente";

    fetchData();
  }, []);

  const ReloadPage = () => {
    handleFullscreen();
    fetchData();
  };

  // --- Control del flujo ---
  // const comenzar = () => {
  //   setEstado("Identificador");
  //   setTurno(null);
  // };

  const seleccionarId = (name, size) => {
    size !== 0 ? setEstado(["started", name, size]) : setEstado("seleccion");
  };

  const seleccionarServicio = async (tipo) => {
    try {
      const nuevoTurno = await generarTurno(tipo, val);
      //console.log('nuevo turno',tipo,"<-tip",val,"val", nuevoTurno);
      setTurno(nuevoTurno);
      setEstado("confirmado");
    } catch (error) {
      console.error("Error generando turno:", error);
    }
  };

  const print = () => {
    console.log("printing....", turno);
  };

  const aceptar = (num) => {
    const limpio = num.replace(/-/g, "");
    //console.log('paso 1', limpio)
    limpio.length === 10
      ? SendTwilioSms("Numero de ticket generado: " + turno, limpio)
      : print();
    setEstado("inicio");
    setTurno(null);
    setVal("");
    fetchData();
  };

  const handleConfirm = () => {
    setOpen(false);
    fetchData();
    setEstado("inicio");
    //alert("Confirmado!");
  };

  // --- Íconos por tipo ---
  const iconoServicio = (tipo) => {
    const iconos = {
      Caja: <FcCurrencyExchange />,
      Servicios: <FcReadingEbook />,
      Informes: <FcInfo />,
    };
    return iconos[tipo] || <FcBusinessContact />;
  };

  // --- Renderizado ---
  return (
    <div
      className={`
        ${estado[0] === "started" ? "cliente-container" : ""}
        ${
          ["seleccion", "confirmado"].includes(estado)
            ? "cliente-container"
            : ""
        }
      `}>
      {/* --- PANTALLA INICIO --- */}
      {estado === "inicio" && (
        <div className="inicio-container">
          <div className="inicio-content">
            <h1 className="inicio-titulo">Bienvenidos a UCNE</h1>
            <div className="inicio-logo" onClick={ReloadPage}>
              <ImgCustoms src={ImgLogo} width="140px" alt="UCNE Logo" />
            </div>

            {/* <p className="inicio-subtitulo">
              Presiona Comenzar para crear un ticket.
            </p> */}

            {/* <button className="inicio-btn" onClick={comenzar}>
              Comenzar
            </button> */}

            {/* <div className="identificador-container"> */}
              <div className="identificador-header">
                <h1 style={{ color: "white" }}>
                  Selecciona un método de identificación
                </h1>
                <p
                  style={{ color: "#a2ceffff" }}
                  className="identificador-subtitle">
                  Elige cómo deseas identificarte para continuar.
                </p>
              </div>

              <div className="identificador-grid">
                {identificaciones.map(({ name, size }) => (
                  <div
                    key={name}
                    className="identificador-card"
                    onClick={() => seleccionarId(name, size)}>
                    <div className="identificador-icon">
                      <FaIdCard />
                    </div>
                    <h2 className="identificador-nombre">{name}</h2>
                  </div>
                ))}
              </div>
            {/* </div> */}
          </div>
        </div>
      )}

      {/* --- IDENTIFICADOR --- */}
      {/* {estado === "Identificador" && (
        
      )} */}

      {/* --- INPUT DE IDENTIFICACIÓN --- */}

      {estado[0] === "started" && estado[2] !== 0 && (
        <FormattedInput
          tipo={estado[1]}
          setEstado={setEstado}
          setVal={setVal}
          size={estado[2]}
        />
      )}

      {/* --- SERVICIOS --- */}
      {estado === "seleccion" && (
        <div className="servicio-container">
          <div className="servicio-header">
            <h1 style={{ color: "white" }}>Seleccione un servicio</h1>
            <p style={{ color: "#afd7ffff" }} className="servicio-subtitle">
              {servicios.length > 0 ? (
                "Elige una opción para generar tu turno."
              ) : (
                <>
                  <h4>No hay servicios disponibles</h4>
                  <hr />
                  Agrega los servicios desde el panel de administrador.
                </>
              )}
            </p>
          </div>

          <div className="servicio-grid">
            {servicios.map(({ service_id, name }) => (
              <div
                key={service_id}
                className="servicio-card"
                onClick={() => seleccionarServicio(service_id)}>
                <div className="servicio-icon">{iconoServicio(name)}</div>
                <h2 className="servicio-nombre">{name}</h2>
              </div>
            ))}
          </div>
          <br />
          <br />
          <button
            style={{
              backgroundColor: "#ffcc00",
              border: "1px solid white",
              color: "#0003afff",
            }}
            className="aceptar-btn"
            onClick={() => setOpen(true)}>
            <strong>Volver al inicio</strong>
          </button>
        </div>
      )}

      {/* --- CONFIRMACIÓN --- */}
      {estado === "confirmado" && turno && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tu turno se ha generado</h2>
            {val.length === 8 && (
              <p>
                Se ha generado un turno para la matrícula.{" "}
                <strong>{val}</strong>
              </p>
            )}
            {val.length === 12 && (
              <p>
                Se ha enviado un SMS a: <strong>{val}</strong> con tu número de
                ticket.
              </p>
            )}
            {(val === 0 || "") && <p>Se ha generado tu número de ticket.</p>}{" "}
            <>
              <hr />
              <h2>
                <strong>{turno}</strong>
              </h2>

              <hr />
            </>
            <button
              className="aceptar-btn"
              style={{
                backgroundColor: "#ffcc00",
                border: "1px solid white",
                color: "#0003afff",
              }}
              onClick={() => aceptar(val)}>
              <strong>Aceptar</strong>
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={open}
        title="Confirmar acción"
        onClose={() => setOpen(false)}
        onConfirm={() => handleConfirm()}
        confirmText="Sí">
        <p>¿Descartar cambios y volver a la pantalla inicial?</p>
      </Modal>
    </div>
  );
};

export default TicketGenerator;
