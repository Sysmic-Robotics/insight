import React, { useState } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { addMessage } from "../store/notificationSlice";
import { useBackendSocketContext } from "../context/BackendSocketContext";
import GamepadConfigurator from "./GamepadConfigurator";

const ConnectionStatus: React.FC = () => {
  const { connected, connect } = useBackendSocketContext();
  const [configOpen, setConfigOpen] = useState(false);
  const [engineRunning, setEngineRunning] = useState(false);
  const dispatch = useDispatch();

  const toggleEngine = async () => {
    const timestamp = new Date().toLocaleTimeString();
    const exePath = "C:\\Robocup\\project\\condorssl\\engine\\build\\engine.exe";

    try {
      if (!engineRunning) {
        const message = await window.api.openEngine(exePath, []);
        dispatch(addMessage({
          timestamp,
          type: "success",
          message: `Engine started: ${message}`,
        }));
        setEngineRunning(true);

        // ✅ Wait before connecting (if needed)
        setTimeout(() => {
          connect(); // Attempt to connect to backend engine
        }, 500);

      } else {
        const message = await window.api.stopEngine();
        dispatch(addMessage({
          timestamp,
          type: "warning",
          message: `Engine stopped: ${message}`,
        }));
        setEngineRunning(false);
      }
    } catch (err) {
      dispatch(addMessage({
        timestamp,
        type: "error",
        message: "Failed to toggle engine",
      }));
    }
  };

  return (
    <div className="flex items-center gap-4 ml-auto">
      {/* Backend connection status */}
      <div className="flex items-center">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${
            connected ? "bg-success-500" : "bg-danger-500"
          }`}
        />
        <span className="text-sm">
          {connected ? "Connected to Backend" : "Disconnected"}
        </span>
      </div>

      {/* Toggle Engine Button */}
      <Tooltip content={engineRunning ? "Stop Engine" : "Start Engine"}>
        <Button
          isIconOnly
          size="sm"
          color={engineRunning ? "danger" : "success"}
          variant="flat"
          onPress={toggleEngine}
          aria-label={engineRunning ? "Stop engine" : "Start engine"}
        >
          <Icon icon={engineRunning ? "lucide:circle-off" : "lucide:rocket"} />
        </Button>
      </Tooltip>

      {/* Gamepad Configurator Button */}
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

      {/* Gamepad Modal */}
      <GamepadConfigurator isOpen={configOpen} onOpenChange={setConfigOpen} />
    </div>
  );
};

export default ConnectionStatus;
