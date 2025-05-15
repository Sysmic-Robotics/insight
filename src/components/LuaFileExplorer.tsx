import React, { useState } from "react";
import { Button } from "@heroui/react";

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
  console.log("LuaFileExplorer renderizado con nodos:", nodes);
  return (
    <Box pl="2">
      {nodes.map((node) =>
        node.type === "folder" ? (
          <Folder key={node.path} node={node} onOpen={onOpen} currentFile={currentFile} />
        ) : (
          <Button
            key={node.path}
            variant={node.path === currentFile ? "solid" : "ghost"}
            size="sm"
            onClick={() => {
              console.log(`Botón clickeado: ${node.name}`); // Log adicional
              console.log(`Archivo clickeado: ${node.name} (${node.path})`);
              onOpen(node.path);
            }}
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
  console.log(`Renderizando componente Folder para: ${node.name}`); // Log para confirmar renderizado
  console.log(`Nodos hijos de ${node.name}:`, node.children); // Verificar datos de nodos hijos

  return (
    <Box>
      <button
        onClick={() => {
          console.log(`Carpeta clickeada: ${node.name}`); // Log adicional para verificar el clic
          const newState = !open;
          console.log(`Toggle folder: ${node.name}. Nuevo estado: ${newState}`);
          setOpen(newState);
        }}
        style={{ width: "100%", justifyContent: "flex-start", fontWeight: "bold", display: "block" }}
      >
        📁 {node.name}
      </button>
      {open && node.children && (
        <Box pl="2" style={{ borderLeft: "1px solid #ccc", marginLeft: "8px" }}>
          {console.log(`Carpeta ${node.name} abierta. Hijos:`, node.children)}
          <LuaFileExplorer nodes={node.children} onOpen={onOpen} currentFile={currentFile} />
        </Box>
      )}
    </Box>
  );
};
