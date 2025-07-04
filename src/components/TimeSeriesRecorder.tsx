import React, { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
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
  const [paused, setPaused] = useState(false); // <-- Add paused state
  const tickRef = useRef(0);

  // Draggable state
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 250 });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Collect data for the selected field
  useEffect(() => {
    if (!recording || paused) return; // <-- Only collect if not paused
    tickRef.current += 1;
    setData((prev) => [
      ...prev,
      { time: tickRef.current, value: getFieldValue(robot, selectedField) },
    ]);
    // eslint-disable-next-line
  }, [robot, selectedField, recording, paused]);

  // Reset data when selectedField changes or recording stops
  useEffect(() => {
    setData([]);
    tickRef.current = 0;
  }, [selectedField, recording]);

  // Drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging.current) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        });
      }
    };
    const handleMouseUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleDragStart = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    dragging.current = true;
    const rect = panelRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Assign a color for each field
  const fieldColors: Record<FieldKey, string> = {
    "position.x": "#8884d8",
    "position.y": "#82ca9d",
    "velocity.x": "#ff7300",
    "velocity.y": "#0088FE",
    "orientation": "#FF69B4",
    "speed": "#00C49F",
  };

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ background: "rgba(0,0,0,0.3)" }}
    >
      <div
        ref={panelRef}
        className="shadow-lg border border-default-300 bg-content1 rounded-lg overflow-hidden"
        style={{
          width: 800,
          height: 500,
          maxWidth: "100vw",
          maxHeight: "100vh",
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: dragging.current ? "move" : "default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="p-2 bg-default-100 border-b border-divider flex justify-between items-center select-none"
          onMouseDown={handleDragStart}
          style={{ cursor: "move" }}
        >
          <span className="text-sm font-medium">Time Series Recorder</span>
          <div className="flex gap-2 items-center">
            {onClose && (
              <Button size="sm" isIconOnly variant="light" onPress={onClose}>
                ✕
              </Button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-3 flex-1 flex flex-col justify-between" style={{ overflow: "hidden" }}>
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex flex-wrap gap-3">
              {fieldOptions.map((opt) => (
                <label key={opt.key} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="field"
                    checked={selectedField === opt.key}
                    onChange={() => setSelectedField(opt.key)}
                  />
                  <span style={{ color: fieldColors[opt.key] }}>{opt.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                onPress={() => setRecording(!recording)}
                color={recording ? "danger" : "success"}
              >
                {recording ? "Stop" : "Start"}
              </Button>
              <Button
                onPress={() => setPaused((p) => !p)}
                color={paused ? "success" : "warning"}
                disabled={!recording}
              >
                {paused ? "Resume" : "Pause"}
              </Button>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            <TimeSeriesPlot
              data={data}
              label={fieldOptions.find(f => f.key === selectedField)?.label || "Value"}
              height={undefined} // Let the chart fill the container
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesRecorder;