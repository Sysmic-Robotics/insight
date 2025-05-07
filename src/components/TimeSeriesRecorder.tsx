// src/components/TimeSeriesRecorder.tsx
import React, { useEffect, useRef, useState } from "react";
import { Select, SelectItem, Button } from "@heroui/react";
import TimeSeriesPlot from "./TimeSeriesPlot";
import type { Robot } from "../hooks/useRobotData";

export type FieldKey = "position.x" | "position.y" | "velocity.x" | "velocity.y" | "orientation" | "speed";

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

  useEffect(() => {
    if (!recording) return;

    tickRef.current += 1;
    const value = getFieldValue(robot, selectedField);
    setData((prev) => [...prev, { time: tickRef.current, value }]);

  }, [robot, selectedField, recording]);

  return (
    <div
      style={{
        position: "fixed",
        top: 100,
        left: 100,
        zIndex: 1000,
        width: 400,
        maxWidth: "90vw",
      }}
      className="shadow-lg border border-default-300 bg-content1 rounded-lg overflow-hidden"
    >
      <div className="cursor-move p-2 bg-default-100 border-b border-divider flex justify-between items-center">
        <span className="text-sm font-medium">Time Series Recorder</span>
        {onClose && (
          <Button size="sm" isIconOnly variant="light" onPress={onClose}>
            ✕
          </Button>
        )}
      </div>

      <div className="p-3 space-y-4">
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