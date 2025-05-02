import { useCallback, useRef, useState } from "react";

export function useBackendSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    // Already connected or trying to connect
    if (socketRef.current && socketRef.current.readyState < 2) return;

    const socket = new WebSocket("ws://localhost:9001");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("🟢 WebSocket connected");
      setConnected(true);
    };

    socket.onclose = () => {
      console.log("🔴 WebSocket closed");
      setConnected(false);
    };

    socket.onerror = () => {
      console.log("🔴 WebSocket error");
      setConnected(false);
    };
  }, []);

  return {
    socket: socketRef.current,
    connected,
    connect,
  };
}
