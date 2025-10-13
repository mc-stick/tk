// DateTime.jsx
import { useEffect, useState } from "react";

const DateTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h6 style={{ color: "#fff", marginLeft:"20px",paddingLeft:"0px", textAlign: "right", fontSize: "1.5rem", lineHeight: "1.5" }}>
     {now.toLocaleTimeString()}
      <br />
      <hr />
       {now.toLocaleDateString("es-ES", {
        weekday: "long", // Día (lunes, martes...)
        year: "numeric",
        month: "long",   // Mes completo (enero, febrero...)
        day: "numeric",
      })} 
    </h6>
  );
};

export default DateTime;

