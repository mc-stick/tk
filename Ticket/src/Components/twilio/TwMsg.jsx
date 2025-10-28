export const SendTwilioSms = async (msg, to) => {
  try {
    const response = await fetch("http://localhost:4001/api/msg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg, to }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    return { success: false, error: "Error de conexión" };
  }
};
