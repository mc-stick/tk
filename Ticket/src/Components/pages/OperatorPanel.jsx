import { useState } from "react";
import { useTurno } from "../context/TurnoContext";
import { useAuth } from "../context/AuthContext";
import TopMenu from "../Menu/TopMenu";
import "./OperatorPanel.css";
import { OpTurnoManager } from "./OpTurnoManager";
import TabsNavigation from "../Menu/TabsComponent";

import OpListEspera from "../listas/listaEsperaOp";
import EditProfile from "../cruds/editProfile";

const OperatorPanel = () => {
  const { user } = useAuth();
  const { llamarSiguiente, turnoActual, cola, llamarTurnoPorId } = useTurno();

  const [showBTNFIN, setShowBTNFIN] = useState(false);

  /////////////////////////////////////////////////
  const handleLlamarSiguiente = () => {
    //llamarSiguiente(("#1"));   //ESTE ES SOLO PARA PRUEBAS.....
    llamarSiguiente(user?.username || "#1"); // USAR ESTE......

    cola.length > 0 ? setShowBTNFIN(true) : setShowBTNFIN(false);
  };

  const handleLlamarTurnoManual = async (turnoId) => {
    // const turnoId = 42; // o lo que selecciones desde un input
    // console.log(x.tipo)

    const puesto = user?.username || "#1";
    const resultado = await llamarTurnoPorId(turnoId.id, puesto);

    if (resultado) {
      console.log("Turno llamado manualmente:", resultado);
    } else {
      console.warn("No se pudo llamar el turno.");
    }
  };

  //TABS ///////////////////////////////////////////
  const tabs = [
    {
      id: "next",
      label: "Turnos en espera",
      content: (
        <OpListEspera
          data={{ turnoActual, cola, user }}
          onLlamarTurno={(turno) => {
            console.log("Turno seleccionado para llamar:", turno);
            // Podés hacer una llamada API personalizada aquí, por ejemplo:
            handleLlamarTurnoManual(turno);
          }}
          btn={
            <OpTurnoManager
              data={{ turnoActual, cola, showBTNFIN, handleLlamarSiguiente }}
            />
          }
        />
      ),
    },
    {
      id: "emplid",
      label: "Configuración",
      content: <EditProfile employeeId={user.employee_id} />,
    },
  ];

  return (
    <div className="operator-container">
      <TopMenu />
      <br />
      <TabsNavigation
        style={{ paddingTop: "3rem", margingTop: "3rem" }}
        tabs={tabs}
      />
    </div>
  );
};

export default OperatorPanel;
