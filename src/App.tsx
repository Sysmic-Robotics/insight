// src/App.tsx
import React, { useState } from "react";
import { Navbar, NavbarBrand, Divider, Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import ConnectionStatus from "./components/ConnectionStatus";
import RobotDataPanel from "./components/RobotDataPanel";
import FileExplorer, { LuaFileNode } from "./components/FileExplorer";
import Terminal from "./components/Terminal";
import { useRobotData } from "./hooks/useRobotData";
import { BackendSocketProvider } from "./context/BackendSocketContext";
import FieldCodePanel from "./components/FieldCodePanel";

function InnerApp() {
  const { robots, ball } = useRobotData();

  // ─── Lua File Explorer State ─────────────────────────────────────────
  const [luaTree, setLuaTree] = useState<LuaFileNode[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [filePath, setFilePath]       = useState<string | null>(null);

  const openFolder = async () => {
    const tree = await window.api.selectLuaFolder();
    if (tree) {
      setLuaTree(tree);
      setCurrentFile(null);
      setFilePath(null);
    }
  };

  const openLuaFile = async (path: string) => {
    const result = await window.api.readLuaFile(path);
    if (result?.content) {
      setCode(result.content);
      setCurrentFile(path);
      setFilePath(path);
    }
  };

  // ─── Code Editor State (lifted) ────────────────────────────────────────
  const [code, setCode] = useState<string>(
    `// start typing your TSX here\nfunction Foo() {\n  return <div>Hello world</div>;\n}`
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-content1">
      {/* Top Bar */}
      <Navbar maxWidth="full" className="border-b border-divider h-14">
        <NavbarBrand>
          <Icon icon="logos:robot-framework" className="text-2xl mr-2" />
          <p className="font-bold text-inherit">RoboCup SSL Developer</p>
        </NavbarBrand>
        <ConnectionStatus />
      </Navbar>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Card className="w-80 h-full rounded-none shadow-none border-r border-divider">
          <div className="flex flex-col h-full">
            {/* Robot Data Panel */}
            <div className="flex-1 overflow-auto">
              <div className="p-3 font-medium text-sm flex items-center">
                <Icon icon="lucide:cpu" className="mr-2" />
                Robot Data
              </div>
              <Divider />
              <RobotDataPanel />
            </div>

            {/* File Explorer Panel */}
            <div className="flex-1 overflow-auto border-t border-divider">
              <div className="p-3 font-medium text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <Icon icon="lucide:folder" className="mr-2" />
                  File Explorer
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  onPress={openFolder}
                  isIconOnly
                  aria-label="Open Folder"
                >
                  <Icon icon="lucide:folder-open" />
                </Button>
              </div>
              <Divider />
              <FileExplorer
                nodes={luaTree}
                currentFile={currentFile}
                onOpen={openLuaFile}
              />
            </div>
          </div>
        </Card>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Field / Code Panel */}
          <FieldCodePanel
            robots={robots}
            ball={ball}
            code={code}
            setCode={setCode}
          />

          {/* Terminal Panel */}
          <Card className="h-1/4 rounded-none shadow-none">
            <div className="p-3 font-medium text-sm flex items-center border-b border-divider">
              <Icon icon="lucide:terminal" className="mr-2" />
              Terminal
            </div>
            <Terminal />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BackendSocketProvider>
      <InnerApp />
    </BackendSocketProvider>
  );
}
