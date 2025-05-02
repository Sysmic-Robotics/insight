import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Field } from "./components/Field";
import { Topbar } from "./components/TopBar";
import { TerminalPanel } from "./components/TerminalPanel";
import { LuaFileExplorer, LuaFileNode } from "./components/LuaFileExplorer";
import { useRobotData } from "./hooks/useRobotData";
import { BackendSocketProvider, useBackendSocketContext } from "./context/BackendSocketContext";
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { CodeEditor } from "./components/CodeEditor"; // ✅ Add this import
import { Button } from "@radix-ui/themes";

function InnerApp() {
  const { connected } = useBackendSocketContext();
  const { robots, ball, updateTimeUs } = useRobotData();

  const [luaTree, setLuaTree] = useState<LuaFileNode[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const openFolder = async () => {
    const tree = await window.api.selectLuaFolder();
    setLuaTree(tree);
  };

  const openLuaFile = async (filePath: string) => {
    const result = await window.api.readLuaFile(filePath);
    if (result?.content) {
      setCode(result.content);
      setCurrentFile(filePath);   // ✅ for selection
      setFilePath(filePath);      // ✅ for saving
    }
  };
  



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
      {/* Sidebar + Explorer */}
      <div style={{ gridRow: "1 / span 3", gridColumn: "1", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Sidebar robots={robots} />
        <Button onClick={openFolder} size="1" style={{ margin: "4px" }}>📂 Open Folder</Button>
        <LuaFileExplorer nodes={luaTree} onOpen={openLuaFile} currentFile={currentFile} />
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

          <Button
      onClick={async () => {
        if (filePath) {
          await window.api.saveLuaFileToPath(filePath, code);
          console.log("✅ Saved:", filePath);
        } else {
          alert("⚠️ No file selected to save.");
        }
      }}
    >
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
