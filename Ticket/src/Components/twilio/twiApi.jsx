import React, { useState } from "react";

function Twilio_app() {
  const [msg, setMsg] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [respuesta, setRespuesta] = useState(null);

  const enviarMensaje = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/msg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg, from, to }),
      });

      const data = await response.json();
      setRespuesta(data);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setRespuesta({ success: false, error: "Error de conexión" });
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "Arial" }}>
      <h2>Enviar mensaje</h2>

      <input
        type="text"
        placeholder="De (from)"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        type="text"
        placeholder="Para (to)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <textarea
        placeholder="Mensaje"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        style={{ width: "100%", height: 80, marginBottom: 8 }}
      />

      <button onClick={enviarMensaje} style={{ width: "100%", padding: "10px" }}>
        Enviar mensaje
      </button>

      {respuesta && (
        <pre style={{ background: "#f4f4f4", marginTop: 16, padding: 10 }}>
          {JSON.stringify(respuesta, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default Twilio_app;
