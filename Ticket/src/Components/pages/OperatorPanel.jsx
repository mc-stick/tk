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
  // 🔹 Llamar siguiente ticket desde la cola
  const handleLlamarSiguiente = async () => {
    const puesto = user?.username || "#1";

    const siguiente = await llamarSiguiente(puesto);

    if (siguiente) {
      //console.log("Siguiente turno llamado:", siguiente);
      setShowBTNFIN(true);
    } else {
      //console.warn("No hay turnos pendientes en la cola.");
      setShowBTNFIN(false);
    }
  };

  /////////////////////////////////////////////////
  // 🔹 Llamar ticket específico (manual)
  const handleLlamarTurnoManual = async (turno) => {
    console.log('tueno',turno)
    const puesto = user?.puesto_id;
    //console.log('user',user)

   
    try {
      await llamarTurnoPorId(turno.ticket_id, puesto, turno.assigned_employee, turno.status_id);
      //console.log("Turno llamado manualmente:", turno.ticket_id, puesto, turno.assigned_employee);
      setShowBTNFIN(true);
    } catch (error) {
      console.error("Error al llamar turno manualmente:", error);
    }
  };

  //console.log(turnoActual, cola, user);

  /////////////////////////////////////////////////
  // 🔹 Tabs del panel
  const tabs = [
    {
      id: "next",
      label: "Turnos en espera",
      content: (
        <OpListEspera
          data={{ turnoActual, cola, user }}
          onLlamarTurno={handleLlamarTurnoManual}
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

  /////////////////////////////////////////////////
  return (
    <div className="operator-container">
      <TopMenu />
      <br />
      <TabsNavigation
        style={{ paddingTop: "3rem", marginTop: "3rem" }}
        tabs={tabs}
      />
    </div>
  );
};

export default OperatorPanel;
