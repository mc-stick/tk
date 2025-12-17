import { useEffect, useState } from "react";
import ImgCustoms from "./ImgCustoms";
import App_params_config from "@/Params_config";

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
    <header className=" fixed top-0 z-40 w-full size-80 bg-gradient-to-t  from-blue-900/700 via-blue-900   to-blue-900 border-slate-500 hover:shadow-slate-500/50 text-white flex 
    justify-between items-center p-8 shadow-xl/20  font-poppins ">
      <div className="grid grid-flow-col justify-items-center  ">
        <ImgCustoms src={App_params_config.images.img_logo}  className=" size-40 p-auto " />
        <h1 className=" m-auto text-9xl font-bold text-shadow-lg ml-12">{App_params_config.text.shortname}</h1>
      </div>

      <div  className="text-right">
        <div id="hora" className="text-8xl font-semibold">{time}</div>
        <br />
        <div id="fecha" className="text-7xl font-bold uppercase mt-auto">{date}</div>
      </div>
    </header>
  );
};

export default DateTime;
