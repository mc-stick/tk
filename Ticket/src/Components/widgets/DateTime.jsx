import { useEffect, useState } from "react";
import ImgLogo from "../../assets/img/UcneLogoIcon.png";
import ImgCustoms from "./ImgCustoms";
import "./DateTime.css";

const DateTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString("es-ES", { hour12: true });
  const date = now.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="datetime-header">
      <div className="datetime-left">
        <ImgCustoms src={ImgLogo} width="60px" className="datetime-logo" />
        <h1 className="datetime-title">UCNE</h1>
      </div>

      <div className="datetime-right">
        <div className="datetime-time">{time}</div>
        <div className="datetime-date">{date}</div>
      </div>
    </header>
  );
};

export default DateTime;
