import React from "react";
import { Flex, Text, Box, Button } from "@radix-ui/themes";
import { GearIcon, TimerIcon, RocketIcon } from "@radix-ui/react-icons";
import { useBackendSocketContext } from "../context/BackendSocketContext"; // adjust path

export const Topbar: React.FC<{ connected: boolean; updateTimeUs?: number }> = ({
  connected,
  updateTimeUs,
}) => {
  const { connect } = useBackendSocketContext(); // ✅ from context

  const updateTimeMs =
    updateTimeUs !== undefined ? (updateTimeUs / 1000).toFixed(2) : "—";

  return (
    <Box
      px="4"
      style={{
        height: "30px",
        width: "100%",
        backgroundColor: "var(--gray-12)",
        color: "white",
        zIndex: 10,
      }}
    >
      <Flex align="center" justify="end" height="100%" gap="5">
        <Flex align="center" gap="2">
          <GearIcon />
          <Text size="2" color={connected ? "green" : "red"} weight="medium">
            {connected ? "Connected" : "Disconnected"}
          </Text>

          {!connected && (
            <Button
              variant="solid"
              size="1"
              color="blue"
              onClick={connect} // ✅ now using WebSocket connect
              style={{ marginLeft: "8px", height: "24px" }}
            >
              <RocketIcon />
              Connect
            </Button>
          )}
        </Flex>

        <Flex align="center" gap="2">
          <TimerIcon />
          <Text
            size="2"
            weight="medium"
            style={{
              minWidth: "64px",
              paddingInline: "4px",
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
              whiteSpace: "nowrap",
            }}
          >
            {updateTimeMs} ms
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};