import React, { useEffect, useRef } from "react";

export const TerminalPanel: React.FC<{ logs: string[] }> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs]); // auto-scroll when logs update

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: "#000",
        color: "#0f0",
        fontFamily: "monospace",
        fontSize: "0.85rem",
        padding: "0.75rem 1rem",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        borderTop: "1px solid #333",
        whiteSpace: "pre-wrap",
        boxSizing: "border-box", // 🛠️ key to avoid overflow from padding
      }}
    >
      {logs.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
    </div>
  );
};
