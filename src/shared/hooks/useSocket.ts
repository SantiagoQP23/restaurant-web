import { Manager, Socket } from "socket.io-client";
import { useEffect, useState, useCallback } from "react";

/**
 * @author Santiago Quirumbay
 * @version 1.1 13-04-2025 Add restaurantId to extraHeaders
 */
export const useSocket = (serverPath: string) => {
  const [online, setOnline] = useState<boolean | undefined>(false);

  const [socket, setSocket] = useState<Socket | null>(null);

  const conectarSocket = useCallback(async () => {
    const token = localStorage.getItem("token") || "";

    const manager = new Manager(serverPath, {
      transports: ["websocket"],
    });

    const socketTemp = manager.socket("/", {
      auth: {
        token,
      },
    });

    setSocket(socketTemp);
  }, [serverPath]);

  const desconectarSocket = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  useEffect(() => {
    console.log("Socket status changed:", socket?.connected);
    setOnline(socket?.connected);
  }, [socket]);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("Socket connected");
      setOnline(true);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("disconnect", () => {
      setOnline(false);
    });
  }, [socket]);

  return {
    socket,
    online,
    conectarSocket,
    desconectarSocket,
  };
};
