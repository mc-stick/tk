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
            && acc[servicio].data.push({
                id: ticket.nticket || ticket.ticket_id,
                servicio: ticket.puesto_name || "En espera",
                estado: ticket.estado_ticket || "En espera",
              })
            ;

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

  preview = data.map((item) =>
    item.data.filter(
      (item1) => item1.estado === "Atendiendo" || item1.estado === "En espera"
    )
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* HEADER: DateTime */}
      <div className="h-20 sm:h-24 lg:h-70 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
        <DateTime />
      </div>

      {/* CONTENIDO */}
      <>
        {preview.flat().length === 0 ? (
          <DisplayScreen />
        ) : (
          <div className="h-full w-full font-sans px-4 sm:px-6 lg:px-10 py-6 overflow-hidden">
            {/* Título */}
            <h1 className="text-center text-white font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl mb-8 sm:mb-12 mt-8 sm:mt-12 drop-shadow-2xl tracking-tight">
              Manténgase al tanto de su llamado
            </h1>

            {/* Grid responsive */}
            <div
              className="grid gap-6 justify-center place-content-center mx-auto max-w-[1920px]"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              }}>
              {data.map((section, i) => {
                const filteredData = section.data.filter(
                  (item) =>
                    item.estado === "Atendiendo" || item.estado === "En espera"
                );

                if (filteredData.length === 0) return null;

                return (
                  <div
                    key={i}
                    className="w-full bg-slate-800/40 border border-slate-600/50 rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-md shadow-2xl hover:shadow-blue-900/50 transition-all duration-300">
                    {/* Título de columna */}
                    <h2 className="text-center uppercase font-bold text-white text-2xl sm:text-3xl lg:text-4xl mb-6 pb-4 border-b-2 border-blue-500/60 tracking-wide">
                      {section.title}
                    </h2>

                    {/* Lista */}
                    <div className="space-y-3">
                      {filteredData.slice(0, 9).map((item, j) => (
                        <div
                          key={j}
                          className={`
                  flex items-center justify-between
                  rounded-xl border-2
                  p-4 sm:p-5 lg:p-6
                  transition-all duration-300
                  shadow-lg
                  ${
                    item.servicio !== "En espera"
                      ? "bg-gradient-to-r from-amber-400 to-yellow-400 border-amber-500 hover:shadow-amber-500/50 hover:scale-[1.02]"
                      : "bg-gradient-to-r from-slate-700 to-slate-600 border-slate-500 hover:shadow-slate-500/50"
                  }
                `}>
                          {item.servicio !== "En espera" && (
                            <DemoSpeaker
                              number={item.id}
                              text={item.servicio}
                            />
                          )}

                          <span
                            className={`font-extrabold text-xl sm:text-2xl lg:text-3xl ${
                              item.servicio !== "En espera"
                                ? "text-slate-900"
                                : "text-white"
                            }`}>
                            {item.id}
                          </span>

                          <span
                            className={`
                    font-bold uppercase
                    text-base sm:text-lg lg:text-xl
                    tracking-wide
                    ${
                      item.servicio !== "En espera"
                        ? "text-slate-900"
                        : "text-slate-300"
                    }
                  `}>
                            {item.servicio}
                          </span>
                        </div>
                      ))}

                      {/* Más items */}
                      {filteredData.length > 9 && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-slate-800 border-2 border-blue-700 text-center shadow-lg">
                          <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">
                            … y {filteredData.length - 9} turnos más
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
    </div>
  );
}