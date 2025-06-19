import React, { useEffect, useRef, useState } from "react";
import { Select, SelectItem, Button } from "@heroui/react";
import TimeSeriesPlot from "./TimeSeriesPlot";
import type { Robot } from "../hooks/useRobotData";

export type FieldKey =
  | "position.x"
  | "position.y"
  | "velocity.x"
  | "velocity.y"
  | "orientation"
  | "speed";

const fieldOptions: { key: FieldKey; label: string }[] = [
  { key: "position.x", label: "Position X" },
  { key: "position.y", label: "Position Y" },
  { key: "velocity.x", label: "Velocity X" },
  { key: "velocity.y", label: "Velocity Y" },
  { key: "orientation", label: "Orientation (deg)" },
  { key: "speed", label: "Speed (|v|)" },
];

interface TimeSeriesRecorderProps {
  robot: Robot;
  recording: boolean;
  setRecording: (r: boolean) => void;
  selectedField: FieldKey;
  setSelectedField: (f: FieldKey) => void;
  onClose?: () => void;
}

const getFieldValue = (robot: Robot, field: FieldKey): number => {
  switch (field) {
    case "position.x": return robot.position.x;
    case "position.y": return robot.position.y;
    case "velocity.x": return robot.velocity.x;
    case "velocity.y": return robot.velocity.y;
    case "orientation": return (robot.orientation * 180) / Math.PI;
    case "speed": return Math.sqrt(robot.velocity.x ** 2 + robot.velocity.y ** 2);
  }
};

const TimeSeriesRecorder: React.FC<TimeSeriesRecorderProps> = ({
  robot,
  recording,
  setRecording,
  selectedField,
  setSelectedField,
  onClose,
}) => {
  const [data, setData] = useState<{ time: number; value: number }[]>([]);
  const tickRef = useRef(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    if (!recording) return;

    tickRef.current += 1;
    const value = getFieldValue(robot, selectedField);
    setData((prev) => [...prev, { time: tickRef.current, value }]);
  }, [robot, selectedField, recording]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging.current && !fullscreen) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [fullscreen]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (!panelRef.current || fullscreen) return;
    dragging.current = true;

    const rect = panelRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: fullscreen ? 0 : position.y,
        left: fullscreen ? 0 : position.x,
        width: fullscreen ? "100vw" : 600,
        height: fullscreen ? "100vh" : 500,
        zIndex: 1000,
        maxWidth: "100vw",
        maxHeight: "100vh",
        cursor: fullscreen ? "default" : "move",
      }}
      className="shadow-lg border border-default-300 bg-content1 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-2 bg-default-100 border-b border-divider flex justify-between items-center"
        onMouseDown={handleDragStart}
      >
        <span className="text-sm font-medium">Time Series Recorder</span>
        <div className="flex gap-2 items-center">
          <Button
            size="sm"
            isIconOnly
            variant="light"
            onPress={() => setFullscreen((prev) => !prev)}
            title={fullscreen ? "Restore" : "Expand"}
          >
            {fullscreen ? "🗗" : "🗖"}
          </Button>
          {onClose && (
            <Button size="sm" isIconOnly variant="light" onPress={onClose}>
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 space-y-4" style={{ height: "calc(100% - 48px)", overflow: "auto" }}>
        <div className="flex items-center justify-between gap-4">
          <Select
            label="Field"
            selectedKeys={[selectedField]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as FieldKey;
              setSelectedField(key);
              setData([]);
              tickRef.current = 0;
            }}
            className="w-1/2"
          >
            {fieldOptions.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>

          <Button
            onPress={() => setRecording(!recording)}
            color={recording ? "danger" : "success"}
          >
            {recording ? "Stop" : "Start"}
          </Button>
        </div>

        <TimeSeriesPlot
          data={data}
          label={fieldOptions.find((f) => f.key === selectedField)?.label || ""}
        />
      </div>
    </div>
  );
};

export default TimeSeriesRecorder;