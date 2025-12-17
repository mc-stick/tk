import http from "http";
import app from "./app.js";
import { initWebSocket } from "./ws/websocket.js";

const server = http.createServer(app);
initWebSocket(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT); //produccion
});


