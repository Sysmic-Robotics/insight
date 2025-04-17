import React from "react";

export const Topbar: React.FC<{ connected: boolean; updateTimeUs?: number }> = ({
  connected,
  updateTimeUs,
}) => {
  const updateTimeMs =
  updateTimeUs !== undefined ? (updateTimeUs / 1000).toFixed(2) : "—";
  return (
    <div
      style={{
        height: "40px",
        width: "95%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#1f1f1f",
        color: connected ? "#4caf50" : "#f44336",
        padding: "0 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        fontWeight: "bold",
        fontSize: "0.9rem",
        borderBottom: "1px solid #333",
        zIndex: 10,
      }}
    >
      ⚙️ Engine Status: {connected ? "Connected" : "Disconnected"}
      <span style={{ marginLeft: "1.5rem", color: "#aaa" }}>
        ⏱ Update: {updateTimeMs} ms
      </span>
    </div>
  );
};
