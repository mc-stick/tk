import { useEffect, useState } from "react";
import { FcManager, FcServices } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const TopAnimatedHeader = ({ user }) => {
  const [startTransition, setStartTransition] = useState(false);

  const navigate= useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTransition(true);
    }, 5000); // Tiempo antes del cambio
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        /* Animaciones */
        .slide-up {
          animation: slideUp 0.5s forwards;
        }

        .slide-down {
          animation: slideDown 0.5s forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-40px);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Oculta visualmente después de la animación */
        .hidden-after {
          display: none;
        }

         /*  volver a home btn */
         .panelOP{
          font-size:1.5rem;
          cursor: pointer;

         }

         .Title-Page:hover{
          color:#b18700;
          font-size:1.8rem;
          
         }

      `}</style>

      {/* Saludo inicial */}
      <div
        className={`topmenu-left ${
          startTransition ? "slide-up hidden-after" : ""
        }`}
      >
        <span className="user-greeting">
          <FcManager size={32} style={{ marginBottom: "-5px" }} /> Hola,{" "}
          <strong className="usr">{user}</strong>
        </span>
      </div>

      {/* Título aparece después */}
      <span
        onClick={() => navigate("/")}
        className={`Title-Page ${startTransition ? "slide-down" : "hidden-after"}`}
      >
        <FcServices size={32} style={{ marginBottom: "-5px" }} />
        <strong title="Volver a inicio" className="panelOP" > Panel de Operaciones</strong>
      </span>
    </>
  );
};

export default TopAnimatedHeader;
