import { useEffect, useState } from "react";
import { FaAngleLeft, FaArrowLeft } from "react-icons/fa";
import { FaLeftLong } from "react-icons/fa6";
import { FcManager, FcServices } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const TopAnimatedHeader = ({ user }) => {
  const [startTransition, setStartTransition] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTransition(true);
    }, 5000); // Tiempo antes del cambio
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Contenedor para el saludo y el título */}
      <div className="flex  space-y-1">
        {/* Saludo inicial */}
        <div
          onClick={() => navigate("/")}
          className={`flex items-center space-x-2 cursor-pointer  transition-all duration-500 ${
            startTransition ? "opacity-100" : "opacity-0"
          }`}> <FaAngleLeft  size={42} className="mb-1 hover:text-yellow-500  ml-15"/><br />
          <FcServices size={32} className="mb-1 ml-5" />
          <strong
            title="Volver a inicio"
            className="text-2xl font-semibold transition-colors">
            Panel de Operaciones
          </strong>
        </div>
       
        {/* Saludo inicial */}
        <div
          className={`flex items-center space-x-2 transition-all duration-1000 ${
            startTransition
              ? "transform -translate-y-10 opacity-0"
              : "opacity-100"
          }`}>
           
          <FcManager size={32} className="mb-1" />
          <span className="text-xl">
            Hola, <strong className="text-yellow-500">{user}</strong>
          </span>
        </div>

        {/* Título del panel */}
      </div>
    </>
  );
};

export default TopAnimatedHeader;
