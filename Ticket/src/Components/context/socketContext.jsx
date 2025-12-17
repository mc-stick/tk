import { createContext, useContext, useEffect } from "react";
import socket from "@/socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket conectado:", socket.id); //produccion
    });

    socket.on("disconnect", () => {
      console.log("Socket desconectado");    //produccion
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
