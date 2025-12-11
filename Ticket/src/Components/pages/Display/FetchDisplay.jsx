import React, { useEffect, useState } from "react";
import DisplayScreen from "./DisplayScreen";
import "./fetch.css";
import DateTime from "../../widgets/DateTime";
import DemoSpeaker from "../../TTS/DEMOindex";

export default function TicketPanel() {
  const [data, setData] = useState([]);
  let preview;

  const services = import.meta.env.VITE_SERVICE_API;

  const API_URL = `${services}/tickets/detail`;

  useEffect(() => {
    const fetchTickets = async () => {
      // agregar btn llamar de nuevo
      try {
        const response = await fetch(API_URL);
        const tickets = await response.json();
        //console.log('tk',tickets)

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
        //console.log(agrupados)

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

  preview = data.map((item) =>
    item.data.filter(
      (item1) => item1.estado === "Atendiendo" || item1.estado === "En espera"
    )
  );
  //const isEmpty = preview.flat().length === 0;
  console.log("prev", preview);
  // console.log("data", data );

  return (
    <div className="bg-blue-900 flex w-screen h-screen">
  {preview.flat().length === 0 ? (
    <DisplayScreen />
  ) : (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Manténgase al tanto de su llamado.
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((section, i) => {
          // Filtramos solo los datos relevantes una sola vez
          const filteredData = section.data.filter(
            (item) => item.estado === "Atendiendo" || item.estado === "En espera"
          );

          // Si no hay datos válidos, no mostramos nada
          if (filteredData.length === 0) return null;

          return (
            <div key={i} className="bg-white p-6 rounded-lg shadow-lg border border-blue-300">
              <h2 className="text-xl font-bold text-blue-700 mb-4">{section.title}</h2>

              <div className="space-y-4">
                {filteredData.slice(0, 9).map((item, j) => (
                  <div
                    key={j}
                    className={`p-4 border border-yellow-200 rounded-md flex items-center justify-between ${
                      item.servicio !== "En espera" ? "bg-blue-100" : "bg-red-100"
                    }`}
                  >
                    {item.servicio !== "En espera" && <DemoSpeaker number={item.id} text={item.servicio} />}
                    <span className="text-lg font-semibold text-gray-800">{item.id}</span>
                    <span className="text-sm text-gray-600">{item.servicio}</span>
                  </div>
                ))}

                {filteredData.length > 10 && (
                  <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50">
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
</div>

  );
}
