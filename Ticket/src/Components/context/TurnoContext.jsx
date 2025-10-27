import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const TurnoContext = createContext();

export const TurnoProvider = ({ children }) => {
  const [cola, setCola] = useState([]);          // Tickets pendientes
  const [turnoActual, setTurnoActual] = useState(null); // Ticket en atención
  const [totalatend, setTotalatend] = useState(null); // Ticket en atención
  const [loading, setLoading] = useState(true);
  

  // 🔹 Traer todos los tickets y separar turnoActual y cola
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4001/api/tickets");
      const tickets = res.data || [];

      //console.log('tickets',tickets)

      // Ticket en atención = status_name "Llamado"
      const actual = tickets.find(t => t.status_name === "Atendiendo") || null;
      // const actual = tickets.filter(t => t.status_name === "Atendiendo");

      // Cola = tickets pendientes
      const pendientes = tickets.filter(t => t.status_name === "En espera");
      const pendientess = tickets.filter(t => t.status_name === "Atendiendo");

      //console.log("actual",actual, "pendiente",pendientes);
      setTurnoActual(actual);
      setCola(pendientes);
      setTotalatend(pendientess)
    } catch (error) {
      console.error("Error al obtener tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000); // refrescar cada 3s
    return () => clearInterval(interval);
  }, []);

  // 🔹 Crear ticket nuevo
  // const generarTurno = async ({ service_id, client_identifier }) => {
  //   try {
  //     const res = await axios.post("http://localhost:4001/api/tickets", {
  //       service_id,
  //       client_identifier,
  //       status_id: 1, // Pendiente
  //       assigned_employee_id: null,
  //       counter_id: null,
  //       notes: ""
  //     });
  //     await fetchTickets();
  //     return res.data.data || null;
  //   } catch (error) {
  //     console.error("Error al generar ticket:", error);
  //     return null;
  //   }
  // };
  const generarTurno = async ( tipo, val ) => {
    console.log('turno context', tipo, val);
  try {
    const res = await axios.post("http://localhost:4001/api/tickets", {
      service_id:tipo,
      client_identifier:val,
      status_id: 1,              // Pendiente
      assigned_employee_id: null,
      puesto_id:null,                 // ✅ reemplaza counter_id
      called_at: null,           // ✅ nuevo campo
      completed_at: null,        // ✅ nuevo campo
      notes: ""
    });
    await fetchTickets();
    return res.data || null;
  } catch (error) {
    console.error("Error al generar ticket:", error);
    return null;
  }
};


  // 🔹 Llamar siguiente ticket (primer pendiente) y actualizar estado usando procedure
  const llamarSiguiente = async (employee_id) => {
    if (cola.length === 0) return null;

    const siguiente = cola[0]; // primer ticket pendiente
    try {
      await axios.put(
        `http://localhost:4001/api/tickets/${siguiente.ticket_id}/status`,
        {
          new_status_id: 2, // Llamado
          employee_id,
          comment: "Llamado al cliente"
        }
      );
      await fetchTickets();
      return siguiente;
    } catch (error) {
      console.error("Error al llamar siguiente ticket:", error);
      return null;
    }
  };

  // 🔹 Llamar un ticket específico por ID
  const llamarTurnoPorId = async (ticket_id, employee_id, service_id, status_id) => {
    console.log('llamar turno tcontx new',ticket_id,employee_id,status_id, service_id)
    try {
      await axios.put(
        `http://localhost:4001/api/tickets/${ticket_id}/status`,
        {
          status_id,
          employee_id,
          service_id,
          comment: "Llamado por ID"
        }
      );
      await fetchTickets();
    } catch (error) {
      console.error("Error al llamar ticket por ID:", error);
    }
  };

  //console.log('turno y cola', turnoActual,cola)

  return (
    <TurnoContext.Provider
      value={{
        turnoActual,
        cola,
        generarTurno,
        llamarSiguiente,
        llamarTurnoPorId,
        loading,
        totalatend,
      }}
    >
      {children}
    </TurnoContext.Provider>
  );
};

export const useTurno = () => useContext(TurnoContext);
