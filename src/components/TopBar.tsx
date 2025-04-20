import React from "react";
import { Flex, Text, Box } from "@radix-ui/themes";
import { GearIcon, TimerIcon } from "@radix-ui/react-icons";

export const Topbar: React.FC<{ connected: boolean; updateTimeUs?: number }> = ({
  connected,
  updateTimeUs,
}) => {
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
      <Flex
        align="center"
        justify="end"
        height="100%"
        gap="5"
      >
        {/* Engine status */}
        <Flex align="center" gap="2">
          <GearIcon />
          <Text
            size="2"
            color={connected ? "green" : "red"}
            weight="medium"
          >
            {connected ? "Connected" : "Disconnected"}
          </Text>
        </Flex>

        {/* Update time */}
        <Flex align="center" gap="2">
          <TimerIcon />
          <Text
  size="2"
  weight="medium"
  style={{
    minWidth: "64px", // enough space for "9999.99"
    paddingInline: "4px", // ⬅️ smooths out edge compression
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap", // ⬅️ prevents accidental wrapping
  }}
>
  {updateTimeMs} ms
</Text>
        </Flex>
      </Flex>
    </Box>
  );
};
