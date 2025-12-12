import { Server } from "socket.io";

let io = null;

export function initWebSocket(server) {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("Cliente conectado a WebSocket");
    });
}

export { io };
