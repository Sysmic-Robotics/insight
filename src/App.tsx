import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Field } from "./components/Field";
import { Topbar } from "./components/TopBar";
import { TerminalPanel } from "./components/TerminalPanel";
import { Splash } from "./components/Splash";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useRobotData } from "./hooks/useRobotData";
import { BackendSocketProvider } from "./context/BackendSocketContext";
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css'; // <- must be included!

function InnerApp() {
  const connected = useConnectionStatus();
  const { robots, ball, updateTimeUs } = useRobotData();

  const [logs] = useState<string[]>(
    Array.from({ length: 50 }, (_, i) => `[Lua] Log message ${i + 1}`)
  );

  /*
  const handleStart = () => {
    console.log("🟡 Button clicked — attempting to start backend...");
   // window.electron.ipcRenderer.startBackend()
      .then(() => {
        console.log("🟢 Backend started.");
      })
      .catch((err) => {
        console.error("🔴 Failed to start backend:", err);
      });
  };
  */

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "30px 1fr 160px",         // Topbar and Terminal fixed, Field flexible
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >

      {/* Place this somewhere in the layout temporarily, like in the Topbar or below it */}


      {/* Sidebar (spans all rows) */}
      <div style={{ gridRow: "1 / span 3", gridColumn: "1", overflow: "hidden" }}>
        <Sidebar robots={robots} />
      </div>

      {/* Topbar */}
      <div style={{ gridRow: "1", gridColumn: "2" }}>
        <Topbar connected={connected} updateTimeUs={updateTimeUs} />
      </div>

      {/* Field */}
      <div
        style={{
          gridRow: "2",
          gridColumn: "2",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Field robots={robots} ball={ball} />
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
