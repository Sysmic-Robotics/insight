// ConnectionStatus.tsx
import React from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useBackendSocketContext } from "../context/BackendSocketContext"; // adjust path

const ConnectionStatus: React.FC = () => {
  // pull both the connected state and the connect() action from context
  const { connected, connect } = useBackendSocketContext();
  const isConnected = connected;

  return (
    <div className="flex items-center gap-4 ml-auto">
      {/* status indicator */}
      <div className="flex items-center">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${
            isConnected ? "bg-success-500" : "bg-danger-500"
          }`}
        />
        <span className="text-sm">
          {isConnected ? "Connected to Backend" : "Disconnected"}
        </span>
      </div>

      {/* connect button */}
      <Tooltip content={isConnected ? "Already connected" : "Connect"}>
        <Button
          isIconOnly
          size="sm"
          color={isConnected ? "success" : "danger"}
          variant="flat"
          onPress={connect}
          aria-label={
            isConnected
              ? "Already connected to backend"
              : "Connect to backend"
          }
        >
          <Icon icon={isConnected ? "lucide:plug" : "lucide:plug-off"} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ConnectionStatus;
