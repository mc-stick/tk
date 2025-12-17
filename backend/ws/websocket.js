
import { Server } from "socket.io";

let io = null;

export function initWebSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*"   //produccion
        }
    });

    io.on("connection", (socket) => {
        //console.log("Cliente conectado:", socket.id);

        socket.on("disconnect", () => {
            //console.log("Cliente desconectado:", socket.id);
        });
    });
}
