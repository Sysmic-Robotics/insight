import React from "react";
import { Input, Code } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { addMessage, LogEntry } from "../store/notificationSlice";

const Terminal: React.FC = () => {
  const [command, setCommand] = React.useState("");
  const externalLogs = useSelector((state: RootState) => state.notification.messages);
  const [localLogs, setLocalLogs] = React.useState<LogEntry[]>([]);
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  // Scroll to bottom when logs change
  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [externalLogs, localLogs]);

  // Listen for engine output
  React.useEffect(() => {
    window.api.onTerminalOutput((data: string) => {
      const timestamp = new Date().toLocaleTimeString();
      dispatch(addMessage({
        timestamp,
        type: "info",
        message: data.trim(),
      }));
    });
  }, [dispatch]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && command.trim()) {
      const now = new Date().toLocaleTimeString();
      const userInput: LogEntry = {
        timestamp: now,
        type: "info",
        message: `> ${command}`,
      };
      setLocalLogs((prev) => [...prev, userInput]);

      // Mock response logic
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

  const allLogs = [...externalLogs, ...localLogs];

  const startEngine = async () => {
    const exePath = "C:\\Robocup\\project\\condorssl\\engine\\build\\engine.exe"; // 🔧 Update this
    const message = await window.api.openEngine(exePath, []);
    const timestamp = new Date().toLocaleTimeString();
    dispatch(addMessage({
      timestamp,
      type: "success",
      message: `Engine: ${message}`,
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-2 bg-content2 border-b border-divider">
        <span className="font-mono text-sm text-default-500">Terminal</span>
        <button
          className="text-xs px-2 py-1 bg-success-600 text-white rounded hover:bg-success-700"
          onClick={startEngine}
        >
          Start Engine
        </button>
      </div>

      {/* Log Display */}
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

      {/* Command Input */}
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
