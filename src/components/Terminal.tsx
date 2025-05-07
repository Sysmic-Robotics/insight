import React from "react";
import { Input, Code } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { LogEntry } from "../store/notificationSlice";

const Terminal: React.FC = () => {
  const [command, setCommand] = React.useState("");
  const externalLogs = useSelector((state: RootState) => state.notification.messages);
  const [localLogs, setLocalLogs] = React.useState<LogEntry[]>([]);
  const terminalRef = React.useRef<HTMLDivElement>(null);

  // Whenever logs change, scroll to bottom
  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [externalLogs, localLogs]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && command.trim()) {
      const now = new Date().toLocaleTimeString();
      const userInput: LogEntry = {
        timestamp: now,
        type: "info",
        message: `> ${command}`,
      };
      setLocalLogs((prev) => [...prev, userInput]);

      // mock response
      setTimeout(() => {
        let response: LogEntry = {
          timestamp: now,
          type: "info",
          message: "Command not recognized",
        };
        if (command.includes("help")) {
          response.message = "Available commands: status, connect, disconnect, reset";
        } else if (command.includes("status")) {
          response.message = "System status: 4/5 robots online, vision system active";
          response.type = "success";
        } else if (command.includes("reset")) {
          response.message = "Resetting system...";
        }
        setLocalLogs((prev) => [...prev, response]);
      }, 300);

      setCommand("");
    }
  };

  const getLogColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "info":
        return "text-default-600";
      case "warning":
        return "text-warning-600";
      case "error":
        return "text-danger-600";
      case "success":
        return "text-success-600";
      default:
        return "text-default-600";
    }
  };

  // Merge Redux logs and local logs — both arrays are in chronological order
  const allLogs = [...externalLogs, ...localLogs];

  return (
    <div className="flex flex-col h-full">
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 pb-14 scroll-pb-14 font-mono text-sm bg-content1"
      >
        {allLogs.map((log, idx) => (
          <div key={idx} className="mb-1">
            <span className="text-default-400">[{log.timestamp}]</span>{" "}
            <span className={getLogColor(log.type)}>{log.message}</span>
          </div>
        ))}
      </div>
      <div className="flex-none p-2 border-t border-divider bg-content1 sticky bottom-0 z-10">
        <Input
          fullWidth
          placeholder="Enter command..."
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleCommand}
          startContent={<Icon icon="lucide:terminal" />}
          endContent={<Code className="text-xs bg-default-100 px-1">Enter</Code>}
          classNames={{ input: "font-mono" }}
        />
      </div>
    </div>
  );
};

export default Terminal;
