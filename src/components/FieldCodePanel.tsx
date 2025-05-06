// src/components/FieldCodePanel.tsx
import React, { useState } from "react";
import { Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import FieldVisualization from "./FieldVisualization";
import { CodeEditor } from "./CodeEditor";
import { useBackendSocketContext } from "../context/BackendSocketContext";
import { useScriptRunner } from "../hooks/useScriptRunner";

interface FieldCodePanelProps {
  robots: ReturnType<typeof import("../hooks/useRobotData").useRobotData>["robots"];
  ball:   ReturnType<typeof import("../hooks/useRobotData").useRobotData>["ball"];
  /** Initial code, if you want to override the default */
  initialCode?: string;
}

const DEFAULT_CODE = `// start typing your TSX here
function Foo() {
  return <div>Hello world</div>;
}`;

export default function FieldCodePanel({
  robots,
  ball,
  initialCode = DEFAULT_CODE,
}: FieldCodePanelProps) {
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState<string>(initialCode);

  // pull socket from context and hook up run/pause logic
  const { socket } = useBackendSocketContext();
  const { scriptState, toggle } = useScriptRunner(socket);

  return (
    <Card className="flex-1 rounded-none shadow-none border-b border-divider">
      <div className="p-3 font-medium text-sm flex items-center justify-between border-b border-divider">
        {/* title */}
        <div className="flex items-center">
          <Icon
            icon={showCode ? "lucide:code" : "lucide:layout-grid"}
            className="mr-2"
          />
          <span>{showCode ? "Code Editor" : "Field Visualization"}</span>
        </div>

        {/* buttons: run/pause + toggle view */}
        <div className="flex items-center space-x-2">
          {/* Run / Pause */}
          <Button
            size="sm"
            variant="flat"
            color={scriptState === "running" ? "warning" : "success"}
            onPress={toggle}
            isIconOnly
            aria-label={
              scriptState === "running" ? "Pause Script" : "Run Script"
            }
          >
            <Icon
              icon={scriptState === "running" ? "lucide:pause" : "lucide:play"}
            />
          </Button>

          {/* Toggle Field / Code */}
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => setShowCode((prev) => !prev)}
            isIconOnly
            aria-label={showCode ? "Show Field" : "Show Code"}
          >
            <Icon icon={showCode ? "lucide:layout-grid" : "lucide:code"} />
          </Button>
        </div>
      </div>

      {/* content */}
      <div className="flex-1">
        {showCode ? (
          <CodeEditor
            value={code}
            onChange={setCode}
            language="typescript"
            height="100%"
          />
        ) : (
          <FieldVisualization robots={robots} ball={ball} />
        )}
      </div>
    </Card>
  );
}
