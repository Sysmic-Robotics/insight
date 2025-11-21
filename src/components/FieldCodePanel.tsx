// src/components/FieldCodePanel.tsx
import React, { useState, useEffect } from "react";
import { Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import FieldVisualization from "./FieldVisualization";
import { useBackendSocketContext } from "../context/BackendSocketContext";
import { useScriptRunner } from "../hooks/useScriptRunner";

interface FieldCodePanelProps {
  robots: ReturnType<
    typeof import("../hooks/useRobotData").useRobotData
  >["robots"];
  ball: ReturnType<
    typeof import("../hooks/useRobotData").useRobotData
  >["ball"];
}

export default function FieldCodePanel({
  robots,
  ball
}: FieldCodePanelProps) {
  const [showCode, setShowCode] = useState(false);


  const { socket } = useBackendSocketContext();
  const { scriptState, toggle } = useScriptRunner(socket);


  return (
    <Card className="flex-1 rounded-none shadow-none border-b border-divider">
      {/* Header */}
      <div className="p-3 font-medium text-sm flex items-center justify-between border-b border-divider">
        <div className="flex items-center">
          <Icon
            icon={showCode ? "lucide:code" : "lucide:layout-grid"}
            className="mr-2"
          />
          <span> Field Visualization</span>
        </div>
        <div className="flex items-center space-x-2">

          <Button
            size="sm"
            variant="flat"
            color={scriptState === "running" ? "warning" : "success"}
            onPress={toggle}
            isIconOnly
            title={
              scriptState === "running" ? "Pause Script" : "Run Script"
            }
          >
            <Icon
              icon={
                scriptState === "running"
                  ? "lucide:pause"
                  : "lucide:play"
              }
            />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative">
        {/* Keep Field mounted */}
        <div
          className={`absolute inset-0 ${
            showCode ? "hidden" : "block"
          }`}
        >
          <FieldVisualization robots={robots} ball={ball} />
        </div>


      </div>
    </Card>
  );
}
