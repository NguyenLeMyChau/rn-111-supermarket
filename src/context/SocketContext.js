import React, { createContext, useContext, useEffect } from "react";
import { connectSocket, disconnectSocket, emitSocketEvent, onSocketEvent } from "../services/socket";


const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ emitSocketEvent, onSocketEvent }}>
      {children}
    </SocketContext.Provider>
  );
};
