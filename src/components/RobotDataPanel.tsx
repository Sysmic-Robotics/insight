// src/components/RobotDataPanel.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Select, SelectItem, Card, Chip, Button } from "@heroui/react";
import type { Robot as RobotType } from "../hooks/useRobotData";
import TimeSeriesRecorder from "./TimeSeriesRecorder";

interface RobotDataPanelProps {
  robots: RobotType[];
}

type FieldKey = "position.x" | "position.y" | "velocity.x" | "velocity.y" | "orientation";

const makeKey = (r: RobotType) => `${r.team}-${r.id}`;

const RobotDataPanel: React.FC<RobotDataPanelProps> = ({ robots }) => {
  const last3 = (value: number) => value.toFixed(3);

  const [selectedKey, setSelectedKey] = useState<string>(
    robots.length ? makeKey(robots[0]) : ""
  );
  const [showChart, setShowChart] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldKey>("position.x");
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!robots.find((r) => makeKey(r) === selectedKey)) {
      setSelectedKey(robots.length ? makeKey(robots[0]) : "");
    }
  }, [robots, selectedKey]);

  const selectedRobot = useMemo(
    () => robots.find((r) => makeKey(r) === selectedKey) || null,
    [robots, selectedKey]
  );

  const getTeamColor = (team: RobotType["team"]) =>
    team === "blue" ? "primary" : "warning";

  return (
    <div className="p-2 flex flex-col h-full">
      {/* Robot Selector */}
      <Select
        label="Select Robot"
        className="mb-4"
        selectedKeys={selectedKey ? [selectedKey] : []}
        onSelectionChange={(keys) => {
          const raw = Array.from(keys)[0];
          const key = String(raw);
          setSelectedKey(key);
        }}
      >
        {robots.map((robot) => (
          <SelectItem
            key={makeKey(robot)}
            startContent={
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  robot.team === "blue" ? "bg-blue-500" : "bg-yellow-500"
                }`}
              />
            }
          >
            Robot {robot.id} ({robot.team})
          </SelectItem>
        ))}
      </Select>

      {/* Details Card */}
      {selectedRobot && (
        <>
          <Card className="p-4 flex-1 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">
                Robot {selectedRobot.id} ({selectedRobot.team})
              </h3>
              <Chip
                color={getTeamColor(selectedRobot.team)}
                variant="flat"
                size="sm"
                className="capitalize"
              >
                {selectedRobot.team}
              </Chip>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-default-50 rounded-md">
                <span className="font-medium">Position</span>
                <span>
                  X: {last3(selectedRobot.position.x)}, Y: {last3(selectedRobot.position.y)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-default-50 rounded-md">
                <span className="font-medium">Orientation</span>
                <span>
                  {((selectedRobot.orientation * 180) / Math.PI).toFixed(0)}°
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-default-50 rounded-md">
                <span className="font-medium">Velocity</span>
                <span>
                  X: {last3(selectedRobot.velocity.x)}, Y: {last3(selectedRobot.velocity.y)}
                </span>
              </div>
            </div>
          </Card>

          <div className="mt-3">
            <Button
              fullWidth
              variant="flat"
              onPress={() => setShowChart((prev) => !prev)}
            >
              {showChart ? "Hide Chart" : "Show Chart"}
            </Button>
          </div>

          {showChart && selectedRobot && (
            <TimeSeriesRecorder
              robot={selectedRobot}
              recording={recording}
              setRecording={setRecording}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              onClose={() => setShowChart(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RobotDataPanel;
