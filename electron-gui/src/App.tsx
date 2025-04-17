import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Field } from "./components/Field";
import { Topbar } from "./components/Topbar";
import { TerminalPanel } from "./components/TerminalPanel";
import { Splash } from "./components/Splash";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useRobotData } from "./hooks/useRobotData";
import { BackendSocketProvider } from "./context/BackendSocketContext";

function InnerApp() {
  const connected = useConnectionStatus();
  const { robots, ball, updateTimeUs } = useRobotData();

  // Test logs for terminal
  const [logs] = useState<string[]>(
    Array.from({ length: 50 }, (_, i) => `[Lua] Log message ${i + 1}`)
  );

  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          backgroundColor: "crimson", // 🟥 Sidebar
        }}
      />

      {/* Main content area */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#111", // main column bg
        }}
      >
        {/* Topbar (fixed height) */}
        <div
          style={{
            height: "40px",
            backgroundColor: "royalblue", // 🟦 Topbar
          }}
        />

        {/* Field (flexes to fill) */}
        <div
          style={{
            flexGrow: 1,
            backgroundColor: "limegreen", // 🟩 Field
          }}
        />

        {/* Terminal (fixed height) */}
        <div
          style={{
            height: "160px",
            backgroundColor: "black", // ⬛ Terminal
          }}
        />
      </div>
    </div>
  );


  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* Sidebar (fixed width) */}
      <Sidebar robots={robots} />

      {/* Main content area (fills remaining space) */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar at top of right column */}
        <div style={{ height: "40px", position: "relative" }}>
          <Topbar connected={connected} updateTimeUs={updateTimeUs} />
        </div>

        {/* Field and terminal split the rest vertically */}
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {/* Field fills available vertical space */}
          <div style={{ flexGrow: 1, position: "relative", overflow: "hidden" }}>
            <Field robots={robots} ball={ball} />
          </div>

          {/* TerminalPanel fixed height */}
          <div style={{ height: "160px", width: "100%" }}>
            <TerminalPanel logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <BackendSocketProvider>
      <InnerApp />
      {showSplash && <Splash onFinish={() => setShowSplash(false)} />}
    </BackendSocketProvider>
  );
}

export default App;
