import { useState, useEffect } from "react";
import { useTurno } from "../context/TurnoContext";
import { useAuth } from "../context/AuthContext";
import TopMenu from "../Menu/TopMenu";
import TabsNavigation from "../Menu/TabsComponent";
import { OpTurnoManager } from "./OpTurnoManager";
import OpListEspera from "../listas/listaEsperaOp";
import EditProfile from "../cruds/editProfile";

const OperatorPanel = () => {
  const { user } = useAuth();
  const { turnoActual, cola, llamarTurnoPorId } = useTurno();
  const [showBTNFIN, setShowBTNFIN] = useState(false);

  useEffect(() => {
    document.title = "UCNE | Panel de operaciones";
  }, []);

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
    <div className="bg-blue-800 min-h-screen flex flex-col text-gray-100">
      {/* Top Menu */}
      <TopMenu datausr={user} />

      {/* Main Content */}
      <div className="flex-grow p-6 bg-blue-900 rounded-xl shadow-lg">
        <TabsNavigation tabs={tabs} />
      </div>

      {/* Botón flotante "Terminar Turno" */}
      {/* {showBTNFIN && (
        <div className="fixed bottom-6 right-6 p-4 bg-blue-500 rounded-full shadow-md hover:scale-105 transition-all">
          <button className="font-semibold text-white">
            Terminar Turno
          </button>
        </div>
      )} */}
    </div>
  );
};

export default OperatorPanel;
