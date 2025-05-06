// src/components/FileExplorer.tsx
import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { Icon } from "@iconify/react";

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
    const isSelected = node.path === currentFile;
    const indentStyle = { paddingLeft: depth * 16 + 8 };
    if (node.type === "folder") {
      return (
        <AccordionItem
          key={node.path}
          title={
            <div className="flex items-center" style={indentStyle}>
              <Icon icon="lucide:folder" className="mr-2 text-default-500" />
              <span>{node.name}</span>
            </div>
          }
          className="px-0"
        >
          {node.children?.map((child) => renderNode(child, depth + 1))}
        </AccordionItem>
      );
    }

    return (
      <AccordionItem
        key={node.path}
        isCompact
        title={node.name}
        startContent={<Icon icon="lucide:file-text" className="text-default-500" />}  
        className={`px-0 ${isSelected ? "bg-default-200 font-semibold" : ""}`}
        onPress={() => onOpen(node.path)}
      />
    );
  };

  return (
    <div className="p-2 h-full overflow-auto">
      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={nodes.map((n) => n.path)}
      >
        {nodes.map((node) => renderNode(node))}
      </Accordion>
    </div>
  );
};

export default FileExplorer;
