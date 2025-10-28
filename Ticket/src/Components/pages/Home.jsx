import { useNavigate } from "react-router-dom";
import {
  FcAssistant,
  FcAutomatic,
  FcTouchscreenSmartphone,
  FcTabletAndroid,
} from "react-icons/fc";
import { useEffect } from "react";
import iconlg from "../../assets/img/UcneLogoIcon.png";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "UCNE | Gestor de Colas";
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) favicon.href = iconlg;
  }, []);

  const opciones = [
    {
      label: "Cliente",
      icon: <FcTouchscreenSmartphone size={50} />,
      route: "/cliente",
      color: "#0066cc",
    },
    {
      label: "Operador",
      icon: <FcAssistant size={50} />,
      route: "/login/operador",
      color: "#1e8449",
    },
    {
      label: "Pantalla",
      icon: <FcTabletAndroid size={50} />,
      route: "/pantalla",
      color: "#cc8800",
    },
    {
      label: "Administrador",
      icon: <FcAutomatic size={50} />,
      route: "/login/admin",
      color: "#8e44ad",
    },
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <img src={iconlg} alt="UCNE Logo" className="home-logo" />
        <h1 className="home-title">Sistema de Gestión de Turnos UCNE</h1>
        <p className="home-subtitle">
          Selecciona el tipo de dispositivo para continuar
        </p>
      </div>

      <div className="home-grid">
        {opciones.map(({ label, icon, route, color }) => (
          <button
            key={label}
            className="home-card"
            onClick={() => navigate(route)}
            style={{ borderTop: `5px solid ${color}` }}
          >
            <div className="home-icon">{icon}</div>
            <h2 className="home-label">{label}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
