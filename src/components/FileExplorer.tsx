// src/components/FileExplorer.tsx
import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";

export type LuaFileNode = {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: LuaFileNode[];
};

type FileExplorerProps = {
  nodes: LuaFileNode[];
  currentFile: string | null;
  onOpen: (path: string) => void;
};

const FileExplorer: React.FC<FileExplorerProps> = ({
  nodes,
  currentFile,
  onOpen,
}) => {
  const renderNode = (node: LuaFileNode, depth = 0) => {
    if (node.type === "folder") {
      return (
        <AccordionItem
          key={node.path}
          aria-label={node.name}
          title={`📁 ${node.name}`}
        >
          <Accordion>
            {(node.children || []).map((child) => renderNode(child, depth + 1))}
          </Accordion>
        </AccordionItem>
      );
    }

    return (
      <AccordionItem
        key={node.path}
        aria-label={node.name}
        title={`📄 ${node.name}`}
        onClick={() => {
          console.log(`Archivo clickeado: ${node.name}`);
          onOpen(node.path);
        }}
      />
    );
  };

  return (
    <div className="p-2 h-full overflow-auto">
      <Accordion>{nodes.map((node) => renderNode(node))}</Accordion>
    </div>
  );
};

export default FileExplorer;
