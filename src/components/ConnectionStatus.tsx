import React, { useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useBackendSocketContext } from "../context/BackendSocketContext";
import GamepadConfigurator from "./GamepadConfigurator"; // adjust path as needed

const ConnectionStatus: React.FC = () => {
  const { connected, connect } = useBackendSocketContext();
  const isConnected = connected;

  // Inside your component
const [configOpen, setConfigOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 ml-auto">
      {/* Backend connection status */}
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

      {/* Connect to backend button */}
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

      {/* Configure gamepad button */}
      <Tooltip content="Configure Gamepad">
  <Button
    isIconOnly
    size="sm"
    color="primary"
    variant="flat"
    onPress={() => setConfigOpen(true)}
    aria-label="Configure gamepad"
  >
    <Icon icon="lucide:gamepad-2" />
  </Button>
</Tooltip>

      {/* Gamepad Configurator Modal */}
      
      <GamepadConfigurator
        isOpen={configOpen}
        onOpenChange={setConfigOpen}
      />
    </div>
  );
};

export default ConnectionStatus;
