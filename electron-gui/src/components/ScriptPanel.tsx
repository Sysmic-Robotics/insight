import React, { useRef, useState } from "react";
import { useButton } from "react-aria";
import { useBackendSocketContext } from "../context/BackendSocketContext";

export const ScriptPanel: React.FC = () => {
  const { socket } = useBackendSocketContext();
  const [state, setState] = useState<"idle" | "running" | "paused">("idle");

  const handleClick = () => {
    if (state === "idle" || state === "running") {
      console.log("▶️ Running script...");

      if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
          type: "runScript"
        };
        socket.send(JSON.stringify(message));
        console.log("Sent runScript message:", message);
      } else {
        console.warn("WebSocket is not connected.");
      }

      setState("running");
    } else if (state === "running") {
      console.log("⏸️ Pausing script...");
      setState("paused");
    } else if (state === "paused") {
      console.log("▶️ Resuming script...");
      setState("running");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Script Control</h2>
      <ScriptButton onClick={handleClick} state={state} />
    </div>
  );
};

function ScriptButton({
  onClick,
  state,
}: {
  onClick: () => void;
  state: "idle" | "running" | "paused";
}) {
  const ref = useRef(null);
  const { buttonProps } = useButton({ onPress: onClick }, ref);

  let label = "Run Script";
  if (state === "running") label = "Running...";
  if (state === "paused") label = "Paused";

  const getColor = () => {
    if (state === "idle") return "#2e7d32";
    if (state === "running") return "#1976d2";
    if (state === "paused") return "#f9a825";
  };

  return (
    <button
      {...buttonProps}
      ref={ref}
      style={{
        width: "100%",
        padding: "0.75rem",
        fontSize: "1rem",
        fontWeight: "bold",
        background: getColor(),
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.3s",
      }}
    >
      {state === "running" && (
        <span
          className="spinner"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "14px",
            height: "14px",
            border: "2px solid #fff",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      )}
      {label}
      <style>
        {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        `}
      </style>
    </button>
  );
}
