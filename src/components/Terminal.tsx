import React from "react";
import { Input, Code } from "@heroui/react";
import { Icon } from "@iconify/react";

interface LogEntry {
  timestamp: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
}

const Terminal: React.FC = () => {
  const [command, setCommand] = React.useState("");
  const [logs, setLogs] = React.useState<LogEntry[]>([
    {
      timestamp: "10:23:45",
      type: "info",
      message: "System initialized",
    },
    {
      timestamp: "10:23:46",
      type: "info",
      message: "Connecting to vision system...",
    },
    {
      timestamp: "10:23:48",
      type: "success",
      message: "Connected to vision system",
    },
    {
      timestamp: "10:23:50",
      type: "info",
      message: "Searching for robots...",
    },
    {
      timestamp: "10:23:52",
      type: "warning",
      message: "Robot #3 not responding",
    },
    {
      timestamp: "10:23:55",
      type: "error",
      message: "Failed to connect to Robot #5",
    },
  ]);
  const terminalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && command.trim()) {
      const now = new Date();
      const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      
      setLogs([
        ...logs,
        {
          timestamp,
          type: "info",
          message: `> ${command}`,
        },
      ]);
      
      // Process command (mock response)
      setTimeout(() => {
        let responseType: "info" | "warning" | "error" | "success" = "info";
        let responseMessage = "Command not recognized";
        
        if (command.includes("help")) {
          responseMessage = "Available commands: status, connect, disconnect, reset";
        } else if (command.includes("status")) {
          responseMessage = "System status: 4/5 robots online, vision system active";
          responseType = "success";
        } else if (command.includes("reset")) {
          responseMessage = "Resetting system...";
        }
        
        setLogs((prevLogs) => [
          ...prevLogs,
          {
            timestamp,
            type: responseType,
            message: responseMessage,
          },
        ]);
      }, 300);
      
      setCommand("");
    }
  };

  const getLogColor = (type: string) => {
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

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm bg-content1"
      >
        {logs.map((log, index) => (
          <div key={index} className="mb-1">
            <span className="text-default-400">[{log.timestamp}]</span>{" "}
            <span className={getLogColor(log.type)}>{log.message}</span>
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-divider">
        <Input
          fullWidth
          placeholder="Enter command..."
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleCommand}
          startContent={<Icon icon="lucide:terminal" />}
          endContent={
            <Code className="text-xs bg-default-100 px-1">Enter</Code>
          }
          classNames={{
            input: "font-mono",
          }}
        />
      </div>
    </div>
  );
};

export default Terminal;