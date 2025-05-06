import { useState, useEffect, useCallback } from "react";

export type ScriptState = "idle" | "running" | "paused";

export function useScriptRunner(socket: WebSocket | null) {
  const [scriptState, setScriptState] = useState<ScriptState>("idle");

  // Listen for server‐driven state updates (e.g. stop events)
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (evt: MessageEvent) => {
      let msg;
      try {
        msg = JSON.parse(evt.data);
      } catch {
        return;
      }
      if (msg.type === "scriptStopped") {
        setScriptState("idle");
      }
      // ...handle more incoming message types if needed
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  // Send a run or pause command
  const sendCommand = useCallback(
    (type: "runScript" | "pauseScript") => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type }));
      } else {
        console.warn("WebSocket not open, cannot send:", type);
      }
    },
    [socket]
  );

  // Toggle between run ↔ pause
  const toggle = useCallback(() => {
    if (scriptState === "idle" || scriptState === "paused") {
      sendCommand("runScript");
      setScriptState("running");
    } else {
      sendCommand("pauseScript");
      setScriptState("paused");
    }
  }, [scriptState, sendCommand]);

  return { scriptState, toggle };
}
