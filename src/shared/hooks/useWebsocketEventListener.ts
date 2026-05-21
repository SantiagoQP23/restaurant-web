import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import type { SocketEvent } from "../interfaces/dto/socket.dto";

export const useWebsocketEventListener = <T>(
  event: string,
  callback: (socketEvent: SocketEvent<T>) => void,
) => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket?.on(event, (socketEvent: SocketEvent<T>) => {
      callback(socketEvent);
    });
    return () => {
      socket?.off(event);
    };
  }, [socket]);
};
