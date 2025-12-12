import { useNavigate } from "react-router-dom";
import {
  FcAssistant,
  FcAutomatic,
  FcTouchscreenSmartphone,
  FcTabletAndroid,
} from "react-icons/fc";
import { useEffect } from "react";
import iconlg from "../../assets/img/UcneLogoIcon.png";
import handleFullscreen from "../Buttons/FullScreenbtn";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "UCNE | Gestor de Colas";
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = iconlg;
  }, []);

  const handleDisplay = (label, route) => {
    if (["Cliente", "Pantalla"].includes(label)) {
      handleFullscreen();
    }
    navigate(route);
  };

  const opciones = [
    {
      label: "Cliente",
      icon: <FcTouchscreenSmartphone size={55} />,
      route: "/cliente",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Operador",
      icon: <FcAssistant size={55} />,
      route: "/login/operador",
      color: "from-green-600 to-green-700",
    },
    {
      label: "Pantalla",
      icon: <FcTabletAndroid size={55} />,
      route: "/pantalla",
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Administrador",
      icon: <FcAutomatic size={55} />,
      route: "/login/admin",
      color: "from-purple-600 to-purple-700",
    },
  ];

  return (
    <div
      className="
        min-h-screen w-full 
        flex flex-col items-center justify-center 
        px-4 py-10
        
        bg-gradient-to-br 
        from-blue-900 via-blue-700 to-blue-500
        bg-fixed
      "
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Universidad Católica Nordestana - UCNE
        </h1>

        <img
          src={iconlg}
          alt="UCNE Logo"
          className="mx-auto my-4 size-40 p-3"
        />

        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          Sistema de Gestión de Turnos
        </h2>

        <p className="text-blue-200 mt-2 text-lg">
          Selecciona el tipo de dispositivo para continuar
        </p>
      </div>
      <br />

      {/* Opciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        {opciones.map(({ label, icon, route, color }) => (
          <button
            key={label}
            onClick={() => handleDisplay(label, route)}
            className={`group bg-white shadow-md rounded-xl p-6 cursor-pointer flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-t-8 bg-gradient-to-b ${color}`}
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
              {icon}
            </div>
            <h2 className="text-xl font-semibold text-white group-hover:text-white ">
              {label}
            </h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
