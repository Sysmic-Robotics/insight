import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Field } from "./components/Field";
import { Topbar } from "./components/TopBar";
import { TerminalPanel } from "./components/TerminalPanel";
import { useRobotData } from "./hooks/useRobotData";
import { BackendSocketProvider, useBackendSocketContext } from "./context/BackendSocketContext";
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { CodeEditor } from "./components/CodeEditor"; // ✅ Add this import
import { Button } from "@radix-ui/themes";

function InnerApp() {
  const { connected } = useBackendSocketContext();
  const { robots, ball, updateTimeUs } = useRobotData();

  const [logs] = useState<string[]>(
    Array.from({ length: 50 }, (_, i) => `[Lua] Log message ${i + 1}`)
  );

  const [view, setView] = useState<"field" | "editor">("field");
  const [code, setCode] = useState("function main() end");
  const [filePath, setFilePath] = useState<string | null>(null);

  const toggleView = () => {
    setView((prev) => (prev === "field" ? "editor" : "field"));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "30px 1fr 160px",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      {/* Sidebar */}
      <div style={{ gridRow: "1 / span 3", gridColumn: "1", overflow: "hidden" }}>
        <Sidebar robots={robots} />
      </div>

      {/* Topbar */}
      <div style={{ gridRow: "1", gridColumn: "2", display: "flex", justifyContent: "space-between" }}>
        <Topbar connected={connected} updateTimeUs={updateTimeUs} />
        <div style={{ padding: "4px 8px" }}>
          <Button variant="outline" size="1" onClick={toggleView}>
            {view === "field" ? "Switch to Code Editor" : "Switch to Field View"}
          </Button>
        </div>
      </div>

      {/* Main Panel */}
      <div
  style={{
    gridRow: "2",
    gridColumn: "2",
    position: "relative",
    overflow: "hidden",
  }}
>
  {view === "field" ? (
    <Field robots={robots} ball={ball} />
  ) : (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "4px", display: "flex", gap: "8px" }}>
<Button onClick={async () => {
  const result = await window.api.openLuaFile();
  if (result?.content) {
    setCode(result.content);
    setFilePath(result.path);
  }
}}>
  Open .lua
</Button>
<Button onClick={async () => {
  if (filePath) {
    await window.api.saveLuaFileToPath(filePath, code);
    console.log("🟢 Saved to", filePath);
  } else {
    console.warn("⚠️ No file path set. Open a file first.");
  }
}}>
  Save
</Button>
      </div>
      <div style={{ flex: 1 }}>
        <CodeEditor value={code} onChange={setCode} language="lua" />
      </div>
    </div>
  )}
</div>

      {/* TerminalPanel */}
      <div style={{ gridRow: "3", gridColumn: "2", overflow: "hidden" }}>
        <TerminalPanel logs={logs} />
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Theme appearance="light">
      <BackendSocketProvider>
        <InnerApp />
      </BackendSocketProvider>
    </Theme>
  );
}

export default App;
