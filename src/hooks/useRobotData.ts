import { useEffect, useState } from "react";
import { useBackendSocketContext } from "../context/BackendSocketContext";

export type Position = { x: number; y: number };
export type Velocity = { x: number; y: number };

export type Robot = {
  id: number;
  team: "blue" | "yellow";
  position: Position;
  velocity: Velocity;
  orientation: number;
};

export type Ball = {
  position: Position;
  velocity: Velocity;
};

export function useRobotData() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [ball, setBall] = useState<Ball | null>(null);
  const [updateTimeUs, setUpdateTimeUs] = useState<number | null>(null);
  const { socket } = useBackendSocketContext();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.robots) setRobots(data.robots);
        if (data.ball) setBall(data.ball);
        if (data.metrics?.updateTimeUs !== undefined) {
          setUpdateTimeUs(data.metrics.updateTimeUs);
        }
      } catch (err) {
        console.warn("Invalid WebSocket message:", err);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  return { robots, ball, updateTimeUs };
}
