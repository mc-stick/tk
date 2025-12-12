import { useState, useEffect, useRef } from "react";
import { useTurno } from "../context/TurnoContext";
import { FaIdCard } from "react-icons/fa";
import {
  FcBusinessContact,
  FcCurrencyExchange,
  FcInfo,
  FcReadingEbook,
} from "react-icons/fc";
import FormattedInput from "../Inputs/Input";
import ImgCustoms from "../widgets/ImgCustoms";
import ImgLogo from "../../assets/img/UcneLogoIcon.png";
import Modal from "../Buttons/Modal";
import { SendTwilioSms } from "../twilio/TwMsg";
import handleFullscreen from "../Buttons/FullScreenbtn";
import Config_params from '../../../Params_config'

const services = import.meta.env.VITE_SERVICE_API;

// -------------------------------------
//  IDENTIFICACIONES DECLARADAS AQUÍ
// -------------------------------------
const IDENTIFICACIONES = [
  { name: "Matrícula", size: 8 },
  { name: "Teléfono", size: 10 },
  { name: "Sin identificación", size: 0 }
];
// -------------------------------------

const TicketGenerator = () => {
  const { generarTurno } = useTurno();
  const [estado, setEstado] = useState("inicio");
  const [val, setVal] = useState("");
  const [turno, setTurno] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  // --- Inactividad ---
  useEffect(() => {
    const resetInactivity = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (estado !== "inicio") {
        timerRef.current = setTimeout(() => {
          setEstado("inicio");
          setTurno(null);
          setVal("");
        }, 600000);
      }
    };

    const eventos = ["mousemove", "mousedown", "keydown", "touchstart"];
    eventos.forEach((ev) => window.addEventListener(ev, resetInactivity));
    resetInactivity();

    return () => {
      eventos.forEach((ev) => window.removeEventListener(ev, resetInactivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [estado]);

  // --- Cargar Servicios ---
  const fetchData = async () => {
    try {
      const servRes = await fetch(`${services}/services`);
      if (!servRes.ok) throw new Error("Error al cargar datos");

      const servData = await servRes.json();
      setServicios(servData.filter((item) => item.is_active === 1));

    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    document.title = "UCNE | Cliente";
    fetchData();
  }, []);

  const seleccionarId = (name, size) => {
    size !== 0 
      ? setEstado(["started", name, size])
      : setEstado("seleccion");
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
    limpio.length === 10
      ? SendTwilioSms(Config_params.tw.msg_title + turno, limpio)
      : console.log("Imprimir ticket localmente");

    setEstado("inicio");
    setTurno(null);
    setVal("");
    fetchData();
  };

  const handleConfirm = () => {
    setOpen(false);
    fetchData();
    setEstado("inicio");
  };

  // ICONOS
  const iconoServicio = (tipo) => {
    const iconos = {
      Caja: <FcCurrencyExchange size={48} />,
      Servicios: <FcReadingEbook size={48} />,
      Informes: <FcInfo size={48} />,
    };
    return iconos[tipo] || <FcBusinessContact size={48} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center p-4">
      
      {/* --- INICIO --- */}
      {estado === "inicio" && (
        <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
          <ImgCustoms
            src={ImgLogo}
            width="140px"
            alt="UCNE Logo"
            className="cursor-pointer hover:scale-105 transition"
            onClick={fetchData}
          />
          <h1 className="text-4xl font-bold text-white">Bienvenidos a UCNE</h1>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Selecciona un método de identificación
            </h2>
            <p className="text-blue-200">Elige cómo deseas identificarte para continuar.</p>
          </div>

          <div className="grid grid-cols-3 gap-6 w-full">
            {IDENTIFICACIONES.map(({ name, size }) => (
              <button
                key={name}
                onClick={() => seleccionarId(name, size)}
                className="bg-white p-6 rounded-2xl cursor-pointer shadow-lg flex flex-col items-center justify-center hover:scale-105 transition transform"
              >
                <FaIdCard size={36} className="text-blue-700 mb-2" />
                <span className="font-semibold text-gray-800">{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- INPUT DE IDENTIFICACIÓN --- */}
      {estado[0] === "started" && estado[2] !== 0 && (
        <FormattedInput
          tipo={estado[1]}
          setEstado={setEstado}
          setVal={setVal}
          size={estado[2]}
        />
      )}

      {/* --- SELECCIÓN DE SERVICIOS --- */}
      {estado === "seleccion" && (
        <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Seleccione un servicio</h2>
            <p className="text-blue-200">
              {servicios.length > 0
                ? "Elige una opción para generar tu turno."
                : "No hay servicios disponibles. Agrega servicios desde el panel de administrador."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 w-full">
            {servicios.map(({ service_id, name }) => (
              <button
                key={service_id}
                onClick={() => seleccionarServicio(service_id)}
                className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center hover:scale-105 transition transform"
              >
                {iconoServicio(name)}
                <span className="font-semibold text-gray-800 mt-2">{name}</span>
              </button>
            ))}
          </div>

          <button
            className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition"
            onClick={() => setOpen(true)}
          >
            Volver al inicio
          </button>
        </div>
      )}

      {/* --- CONFIRMACIÓN --- */}
      {estado === "confirmado" && turno && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center animate-slide-up">
          <h2 className="text-3xl font-bold mb-4">Tu turno se ha generado</h2>
          {val.length === 8 && <p>Se ha generado un turno para la matrícula <strong>{val}</strong>.</p>}
          {val.length === 12 && <p>Se ha enviado un SMS a <strong>{val}</strong> con tu número de ticket.</p>}
          {(val === 0 || val === "") && <p>Se ha generado tu número de ticket.</p>}

          <hr className="my-4" />
          <h2 className="text-4xl font-extrabold">{turno}</h2>
          <hr className="my-4" />

          <button
            className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition mt-4"
            onClick={() => aceptar(val)}
          >
            Aceptar
          </button>
        </div>
      )}

      {/* --- MODAL CONFIRMACIÓN --- */}
      <Modal
        isOpen={open}
        title="Confirmar acción"
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        confirmText="Sí"
      >
        <p>¿Descartar cambios y volver a la pantalla inicial?</p>
      </Modal>
    </div>
  );
};

export default TicketGenerator;
