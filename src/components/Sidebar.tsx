import React, { useState } from "react";
import { Robot } from "../hooks/useRobotData";
import { RobotSelector } from "./RobotSelector";
import { ScriptPanel } from "./ScriptPanel";
import { Box, ScrollArea, Text } from "@radix-ui/themes";

type SidebarProps = {
  robots: Robot[];
};

export const Sidebar: React.FC<SidebarProps> = ({ robots }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <Box
      width="280px"
      height="100vh"
      style={{
        backgroundColor: "var(--gray-6)", // Dark background
        color: "var(--gray-1)",            // Light text
        boxSizing: "border-box",
      }}
    >
      <ScrollArea type="auto" scrollbars="vertical" style={{ height: "100%" }}>
        <Box p="4">
          <Text as="h2" size="4" weight="bold" mb="4">
            Robot Selector
          </Text>

          

          <RobotSelector
            robots={robots}
            selectedKey={selectedKey}
            onChange={setSelectedKey}
          />

          <ScriptPanel />
        </Box>
      </ScrollArea>
    </Box>
  );
};
