// src/components/FieldCodePanel.tsx
import React, { useState, useEffect } from "react";
import { Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import FieldVisualization from "./FieldVisualization";
import { CodeEditor } from "./CodeEditor";
import { useBackendSocketContext } from "../context/BackendSocketContext";
import { useScriptRunner } from "../hooks/useScriptRunner";

interface FieldCodePanelProps {
  robots: ReturnType<typeof import("../hooks/useRobotData").useRobotData>["robots"];
  ball: ReturnType<typeof import("../hooks/useRobotData").useRobotData>["ball"];
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  filePath: string | null;
}

export default function FieldCodePanel({
  robots,
  ball,
  code,
  setCode,
  filePath,
}: FieldCodePanelProps) {
  const [showCode, setShowCode] = useState(false);

  // keep track of the “original” code when we last loaded/saved from disk
  const [originalCode, setOriginalCode] = useState(code);

  // when a new file is opened (or re-opened), reset our baseline
  useEffect(() => {
    setOriginalCode(code);
  }, [filePath]);

  const { socket } = useBackendSocketContext();
  const { scriptState, toggle } = useScriptRunner(socket);

  const handleSave = async () => {
    if (!filePath) {
      console.warn("No file selected to save.");
      return;
    }
    try {
      await window.api.saveLuaFileToPath(filePath, code);
      // reset baseline to “just saved”
      setOriginalCode(code);
    } catch (err) {
      console.error("Failed to save file:", err);
    }
  };

  return (
    <Card className="flex-1 rounded-none shadow-none border-b border-divider">
      <div className="p-3 font-medium text-sm flex items-center justify-between border-b border-divider">
        {/* Title */}
        <div className="flex items-center">
          <Icon
            icon={showCode ? "lucide:code" : "lucide:layout-grid"}
            className="mr-2"
          />
          <span>{showCode ? "Code Editor" : "Field Visualization"}</span>
          {filePath && code !== originalCode && (
            <span className="ml-2 text-warning-600 text-xs italic">
              (unsaved file)
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={handleSave}
            isIconOnly
            disabled={!filePath}
            title="Save File"
          >
            <Icon icon="lucide:save" />
          </Button>

          <Button
            size="sm"
            variant="flat"
            color={scriptState === "running" ? "warning" : "success"}
            onPress={toggle}
            isIconOnly
            title={scriptState === "running" ? "Pause Script" : "Run Script"}
          >
            <Icon
              icon={scriptState === "running" ? "lucide:pause" : "lucide:play"}
            />
          </Button>

          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => setShowCode((prev) => !prev)}
            isIconOnly
            title={showCode ? "Show Field" : "Show Code"}
          >
            <Icon icon={showCode ? "lucide:layout-grid" : "lucide:code"} />
          </Button>
        </div>
      </div>

      <div className="flex-1">
        {showCode ? (
          <CodeEditor
            value={code}
            onChange={setCode}
            language="lua"
            height="100%"
          />
        ) : (
          <FieldVisualization robots={robots} ball={ball} />
        )}
      </div>
    </Card>
  );
}
