import { useState, useEffect } from "react";
import { useTurno } from "../context/TurnoContext";
import { useAuth } from "../context/AuthContext";
import TopMenu from "../Menu/TopMenu";
import TabsNavigation from "../Menu/TabsComponent";
import { OpTurnoManager } from "./OpTurnoManager";
import OpListEspera from "../listas/listaEsperaOp";
import EditProfile from "../cruds/editProfile";

import "./OperatorPanel.css";

const OperatorPanel = () => {
  const { user } = useAuth();
  const { llamarSiguiente, turnoActual, cola, llamarTurnoPorId } = useTurno();
  const [showBTNFIN, setShowBTNFIN] = useState(false);

  useEffect(() => {
    document.title = "UCNE | Panel de operaciones";
  }, []);

 
  const handleLlamarSiguiente = async () => {
    const puesto = user?.username || "#1";
    const siguiente = await llamarSiguiente(puesto);
    setShowBTNFIN(!!siguiente);
  };

  const handleLlamarTurnoManual = async (turno) => {
    const puesto = user?.puesto_id;
    try {
      await llamarTurnoPorId(
        turno.ticket_id,
        puesto,
        turno.assigned_employee,
        turno.status_id
      );
      setShowBTNFIN(true);
    } catch (error) {
      console.error("Error al llamar turno manualmente:", error);
    }
  };


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

  return (
    <div className="operator-container">
      <TopMenu />

      <div className="operator-content">
        <TabsNavigation tabs={tabs} />
      </div>
    </div>
  );
};

export default OperatorPanel;
