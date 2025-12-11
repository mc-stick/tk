import React, { useEffect, useState } from "react";
import DisplayScreen from "./DisplayScreen";
import DateTime from "../../widgets/DateTime";
import DemoSpeaker from "../../TTS/DEMOindex";

export default function TicketPanel() {
  const [data, setData] = useState([]);
  let preview;

  const services = import.meta.env.VITE_SERVICE_API;

  const API_URL = `${services}/tickets/detail`;

  useEffect(() => {
    const fetchTickets = async () => { 
      try {
        const response = await fetch(API_URL);
        const tickets = await response.json();

        // Agrupar tickets por nombre de servicio
        const agrupados = tickets.reduce((acc, ticket) => {
          const servicio = ticket.service_name || "SIN CATEGORÍA";

          if (!acc[servicio]) {
            acc[servicio] = {
              title: servicio.toUpperCase(),
              data: [],
            };
          }

          ticket.status_name !== "Finalizado"
            ? acc[servicio].data.push({
                id: ticket.nticket || ticket.ticket_id,
                servicio: ticket.puesto_name || "En espera",
                estado: ticket.estado_ticket || "En espera",
              })
            : console.log("");

          return acc;
        }, {});

        // Convertir el objeto agrupado en un arreglo
        const result = Object.values(agrupados);
        setData(result);
      } catch (error) {
        console.error("Error al obtener tickets:", error);
      }
    };

    fetchTickets();

    // Opcional: recargar cada cierto tiempo
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  preview = data.map((item) => item.data.filter((item1) => item1.estado === "Atendiendo" || item1.estado === "En espera"));

  return (
    <>
      {preview.flat().length === 0 ? (
        <DisplayScreen />
      ) : (
        <div className="flex items-center justify-center bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 min-h-screen p-35 font-sans">
          {/* Título general */}
          <h1 className="fixed top-24 text-8xl font-extrabold text-white mb-6">
            Manténgase al tanto de su llamado.
          </h1>

          {/* Grilla de columnas */}
          <div className="flex grid-cols-4  gap-10 w-full min-w-500 max-w-8xl">
            {/* <<--- Cambios importantes en grid y max-w-7xl */}
            {data.map((section, i) => {
              const filteredData = section.data.filter(
                (item) => item.estado === "Atendiendo" || item.estado === "En espera"
              );

              if (filteredData.length === 0) return null;

              return (
                <div key={i} className="w-full bg-blue-900 bg-opacity-10 border border-blue-300 rounded-4xl p-15 backdrop-blur-sm shadow-lg">
                  {/* Título de la columna */}
                  <h2 className="text-6xl font-bold text-white mb-10 text-center border-b-4 border-cyan-400 pb-8 uppercase">
                    {section.title}
                  </h2>

                  {/* Lista de ítems */}
                  <div className="space-y-4">
                    {filteredData.slice(0, 9).map((item, j) => (
                      <div
                        key={j}
                        className={`p-8 border border-cyan-400 rounded-md flex justify-between transition-all duration-300 ${
                          item.servicio !== "En espera" ? "bg-yellow-300" : "bg-gray-100"
                        }`}
                      >
                        {item.servicio !== "En espera" && (
                          <DemoSpeaker number={item.id} text={item.servicio} />
                        )}
                        <span className="text-4xl font-bold text-gray-800">{item.id}</span>
                        <span className={`text-4xl font-bold ${item.servicio !== "En espera" ? "text-green-800" : "text-gray-600"}`}>
                          {item.servicio}
                        </span>
                      </div>
                    ))}

                    {/* Si hay más de 10 items */}
                    {filteredData.length > 10 && (
                      <div className="p-4 border border-yellow-200 rounded-md bg-yellow-100">
                        <span className="text-sm text-gray-600">
                          … y {filteredData.length - 10} turnos más.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
