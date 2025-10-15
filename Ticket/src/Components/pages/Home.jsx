import { useNavigate } from "react-router-dom";
//ICONS
import {
  FcAssistant,
  FcAutomatic,
  FcTouchscreenSmartphone,
  FcTabletAndroid,
} from "react-icons/fc";

const Home = () => {
  const navigate = useNavigate();

  let IconSize = 42;

  return (
    <div  className=" containerStyle input-page-container_index">
      <h1>Selecciona el dispositivo</h1>
      <div className="buttonContainer">
        <button onClick={() => navigate("/cliente")} className="btnStyle">
          <FcTouchscreenSmartphone
            size={IconSize}
            style={{ marginRight: "10px" }}
          />
          Cliente
        </button>
        <button onClick={() => navigate("/login/operador")} className="btnStyle">
          <FcAssistant size={IconSize} style={{ marginRight: "10px" }} />{" "}
          Operador
        </button>
        <button onClick={() => navigate("/pantalla")} className="btnStyle">
          <FcTabletAndroid size={IconSize} style={{ marginRight: "10px" }} />{" "}
          Pantalla
        </button>
        <button onClick={() => navigate("/login/admin")} className="btnStyle">
          <FcAutomatic size={IconSize} style={{ marginRight: "10px" }} />{" "}
          Administrador
        </button>
      </div>
    </div>
  );
};


export default Home;
