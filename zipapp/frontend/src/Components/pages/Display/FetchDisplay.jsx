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
    const fetchTickets = async () => {  // agregar btn llamar de nuevo
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

  preview = data.map((item) => item.data.filter((item1)=>item1.estado === "Atendiendo" || item1.estado === "En espera"));
  //const isEmpty = preview.flat().length === 0;
  console.log("prev", preview );
  // console.log("data", data );

  return (
    <>
      {preview.flat().length === 0 ? (
        //<p style={{ color: "#ccc" }}>Cargando datos...</p>
        <DisplayScreen />
      ) : (
        <div className="board-container">
          {/* <DateTime /> */}
          <h1 className="board-title">Manténgase al tanto de su llamado.</h1>
          <div className="board-grid">
            {data.map((section, i) => {
              // Filtramos solo los datos relevantes una sola vez
              const filteredData = section.data.filter(
                (item) =>
                  item.estado === "Atendiendo" || item.estado === "En espera"
              );

              //console.log("filtered", filteredData);

              // Si no hay datos válidos, no mostramos nada
              if (filteredData.length === 0) return null;

              return (
                <div key={i} className="board-column">
                  <h2 className="column-title">{section.title}</h2>

                  <div className="column-items">
                    {filteredData.slice(0, 9).map((item, j) => (
                      <div
                        key={j}
                        className={`item-card ${
                          item.servicio !== "En espera" ? "active" : ""
                        }`}>
                        {item.servicio !== "En espera" ? (
                          <DemoSpeaker number={item.id} text={item.servicio} />
                        ) : (
                          <></>
                        )}
                        <span className="item-id">{item.id}</span>
                        <span className="item-window">{item.servicio}</span>
                      </div>
                    ))}
                    {filteredData.length > 10 && (
                      <div className="item-card more-items">
                        <span className="item-id">
                          … y {filteredData.length - 10} turnos más.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* {current && (
            <div className="current-customer">
              Atendiendo <span>{current.name}</span> — {current.servicio}
            </div>
          )} */}
        </div>
      )}
    </>
  );
}
