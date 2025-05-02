import React, { useState } from "react";
import { Box, Button, Text } from "@radix-ui/themes";

export type LuaFileNode = {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: LuaFileNode[];
};

type Props = {
  nodes: LuaFileNode[];
  currentFile: string | null;
  onOpen: (path: string) => void;
};

export const LuaFileExplorer: React.FC<Props> = ({ nodes, currentFile, onOpen }) => {
  return (
    <Box pl="2">
      {nodes.map((node) =>
        node.type === "folder" ? (
          <Folder key={node.path} node={node} onOpen={onOpen} currentFile={currentFile} />
        ) : (
          <Button
            key={node.path}
            variant={node.path === currentFile ? "solid" : "ghost"}
            size="1"
            onClick={() => onOpen(node.path)}
            style={{ width: "100%", justifyContent: "flex-start", marginBottom: "2px" }}
          >
            {node.name}
          </Button>
        )
      )}
    </Box>
  );
};

const Folder: React.FC<{ node: LuaFileNode; onOpen: (p: string) => void; currentFile: string | null }> = ({
  node,
  onOpen,
  currentFile,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button
        variant="ghost"
        size="1"
        onClick={() => setOpen(!open)}
        style={{ width: "100%", justifyContent: "flex-start", fontWeight: "bold" }}
      >
        📁 {node.name}
      </Button>
      {open && node.children && (
        <Box pl="2">
          <LuaFileExplorer nodes={node.children} onOpen={onOpen} currentFile={currentFile} />
        </Box>
      )}
    </Box>
  );
};
