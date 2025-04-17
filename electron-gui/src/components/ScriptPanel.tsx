import React, { useState } from "react";
import { Button, IconButton, Flex, Text } from "@radix-ui/themes";
import { PlayIcon, PauseIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useBackendSocketContext } from "../context/BackendSocketContext";

export const ScriptPanel: React.FC = () => {
  const { socket } = useBackendSocketContext();
  const [state, setState] = useState<"idle" | "running" | "paused">("idle");

  const sendSocketMessage = (message: object) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      console.log("Sent message:", message);
    } else {
      console.warn("WebSocket is not connected.");
    }
  };

  const handlePlayPauseClick = () => {
    if (state === "idle" || state === "paused") {
      sendSocketMessage({ type: "runScript" });
      setState("running");
    } else if (state === "running") {
      sendSocketMessage({ type: "pauseScript" });
      setState("paused");
    }
  };

  const handleUpdateClick = () => {
    sendSocketMessage({ type: "updateScript" });
  };

  return (
    <div style={{ width: "100%", marginTop: "1rem" }}>
      <Text as="h3" size="3" weight="bold" mb="2">
        Script Control
      </Text>

      <Flex gap="2" align="center">
        <IconButton
          variant="solid"
          color="gray"
          radius="none"
          onClick={handlePlayPauseClick}
          title={state === "running" ? "Pause Script" : "Run Script"}
          style={
            state === "running"
              ? {
                  animation: "blink 1s linear infinite",
                  outline: "none",
                }
              : { outline: "none" }
          }
        >
          {state === "running" ? <PauseIcon /> : <PlayIcon />}
        </IconButton>

        <Button
          variant="solid"
          color="gray"
          radius="none"
          onClick={handleUpdateClick}
          style={{ flexGrow: 1, outline: "none" }}
        >
          <ReloadIcon />
          Update Script
        </Button>
      </Flex>

      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>
    </div>
  );
};
