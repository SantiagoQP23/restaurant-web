import React, { createContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { getEnvVariables } from "../lib/helpers";
import { useSocket } from "../hooks/useSocket";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export const environments = getEnvVariables();

interface ISocket {
  socket: Socket | null;
  online: boolean | undefined;
  conectarSocket: () => void;
  desconectarSocket: () => void;
}

interface Props {
  children: React.ReactNode;
}

export const SocketContext = createContext({} as ISocket);

export const SocketProvider = ({ children }: Props) => {
  const { socket, online, conectarSocket, desconectarSocket } = useSocket(
    `${environments.VITE_API_URL}/socket.io/socket.io.js`,
  );

  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("Desconectando socket");
      desconectarSocket();
    }
  }, [status, desconectarSocket]);

  useEffect(() => {
    if (status === "authenticated") {
      console.log("conectando socket");
      conectarSocket();
    }
  }, [status, conectarSocket]);

  return (
    <SocketContext.Provider
      value={{ socket, online, conectarSocket, desconectarSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
