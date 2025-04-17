import React, { useState } from "react";
import { Robot } from "../hooks/useRobotData";
import { RobotSelector } from "./RobotSelector";
import { ScriptPanel } from "./ScriptPanel";

type SidebarProps = {
  robots: Robot[];
};

export const Sidebar: React.FC<SidebarProps> = ({ robots }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedRobot = robots.find((r) => r.id === selectedId);

  return (
    <div
      style={{
        width: "300px",
        height: "100vh",
        background: "#1a1a1a",
        color: "#fff",
        padding: "1rem",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <h2>Robot Selector</h2>
      <RobotSelector
        robots={robots}
        selectedId={selectedId}
        onChange={(id) => setSelectedId(id)}
      />

      <ScriptPanel />
    </div>
  );
};
