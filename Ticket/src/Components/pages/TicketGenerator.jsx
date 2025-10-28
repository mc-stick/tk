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

const TicketGenerator = () => {
  const { generarTurno } = useTurno();

  const [estado, setEstado] = useState("inicio");
  const [val, setVal] = useState("");
  const [turno, setTurno] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [identificaciones, setIdentificaciones] = useState([]);

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
        }, 6000); // 1 minuto = 60,000 ms
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

  // --- Cargar datos iniciales ---
  useEffect(() => {
    document.title = "UCNE | Cliente";

    const fetchData = async () => {
      try {
        const [servRes, idRes] = await Promise.all([
          fetch("http://localhost:4001/api/services"),
          fetch("http://localhost:4001/api/docs"),
        ]);

        if (!servRes.ok || !idRes.ok) throw new Error("Error al cargar datos");

        const [servData, idData] = await Promise.all([
          servRes.json(),
          idRes.json(),
        ]);

        setServicios(servData);
        setIdentificaciones(idData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  // --- Control del flujo ---
  const comenzar = () => {
    setEstado("Identificador");
    setTurno(null);
  };

  const seleccionarId = (name, size) => {
    setEstado(["started", name, size]);
  };

  const seleccionarServicio = async (tipo) => {
    try {
      const nuevoTurno = await generarTurno(tipo, val);
      setTurno(nuevoTurno);
      setEstado("confirmado");
    } catch (error) {
      console.error("Error generando turno:", error);
    }
  };

  const aceptar = (num) => {
    const limpio = num.replace(/-/g, "");
    SendTwilioSms("enviado desde tw", limpio);
    setEstado("inicio");
    setTurno(null);
    setVal("");
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
        ${["Identificador", "seleccion", "confirmado"].includes(estado)
          ? "cliente-container"
          : ""}
      `}
    >
      {/* --- PANTALLA INICIO --- */}
      {estado === "inicio" && (
        <div className="inicio-container">
          <div className="inicio-content">
            <div className="inicio-logo">
              <ImgCustoms src={ImgLogo} width="140px" alt="UCNE Logo" />
            </div>
            <h1 className="inicio-titulo">Bienvenidos a UCNE</h1>
            <p className="inicio-subtitulo">
              Presiona Comenzar para crear un ticket.
            </p>

            <button className="inicio-btn" onClick={comenzar}>
              Comenzar
            </button>
          </div>
        </div>
      )}

      {/* --- IDENTIFICADOR --- */}
      {estado === "Identificador" && (
        <div className="identificador-container">
          <div className="identificador-header">
            <h1 style={{ color: "white" }}>
              Selecciona un método de identificación
            </h1>
            <p style={{ color: "#a2ceffff" }} className="identificador-subtitle">
              Elige cómo deseas identificarte para continuar.
            </p>
          </div>

          <div className="identificador-grid">
            {identificaciones.map(({ name, size }) => (
              <div
                key={name}
                className="identificador-card"
                onClick={() => seleccionarId(name, size)}
              >
                <div className="identificador-icon">
                  <FaIdCard />
                </div>
                <h2 className="identificador-nombre">{name}</h2>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- INPUT DE IDENTIFICACIÓN --- */}
      {estado[0] === "started" && (
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
            <h1 style={{ color: "white" }}>
              Seleccione el servicio que desea
            </h1>
            <p style={{ color: "#afd7ffff" }} className="servicio-subtitle">
              Elige una opción para generar tu turno.
            </p>
          </div>

          <div className="servicio-grid">
            {servicios.map(({ service_id, name }) => (
              <div
                key={service_id}
                className="servicio-card"
                onClick={() => seleccionarServicio(service_id)}
              >
                <div className="servicio-icon">{iconoServicio(name)}</div>
                <h2 className="servicio-nombre">{name}</h2>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CONFIRMACIÓN --- */}
      {estado === "confirmado" && turno && (
        <div className="modal">
          <div className="modal-content">
            <h2>Tu turno se ha generado</h2>
            <p>
              Se ha enviado un SMS a: <strong>{val}</strong> con tu número de
              ticket.
            </p>
            <button className="aceptar-btn" onClick={() => aceptar(val)}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketGenerator;
