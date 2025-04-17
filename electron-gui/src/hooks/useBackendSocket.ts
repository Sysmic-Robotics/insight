// src/hooks/useBackendSocket.ts
import { useEffect, useRef, useState } from "react";

export function useBackendSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:9001");
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);

    return () => socket.close();
  }, []);

  return { socket: socketRef.current, connected };
}
