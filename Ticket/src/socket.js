import { io } from "socket.io-client";

const services = import.meta.env.VITE_WS_SOCKET;

const socket = io(services, {
  transports: ["websocket"],
});

export default socket;
