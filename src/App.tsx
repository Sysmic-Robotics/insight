import React, { useState, useRef, useEffect } from "react";
import { Navbar, NavbarBrand, Divider, Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import ConnectionStatus from "./components/ConnectionStatus";
import RobotDataPanel from "./components/RobotDataPanel";
import FileExplorer, { LuaFileNode } from "./components/FileExplorer";
import Terminal from "./components/Terminal";
import { useRobotData } from "./hooks/useRobotData";
import { BackendSocketProvider } from "./context/BackendSocketContext";
import FieldCodePanel from "./components/FieldCodePanel";

const MIN_TERMINAL_HEIGHT = 100; // px

function InnerApp() {
  const { robots, ball } = useRobotData();

  // ─── Lua File Explorer State ─────────────────────────────────────────
  const [luaTree, setLuaTree] = useState<LuaFileNode[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [code, setCode] = useState<string>(
    `-- start typing your Lua here\nfunction foo()\n  print("Hello world")\nend`
  );

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

  // ─── Resizable Terminal Panel State ──────────────────────────────────
  const rightRef = useRef<HTMLDivElement>(null);
  const [termHeight, setTermHeight] = useState<number>(200);
  const [isResizing, setIsResizing] = useState(false);

  // Initialize to 25% of available height once mounted
  useEffect(() => {
    if (rightRef.current) {
      const h = rightRef.current.getBoundingClientRect().height;
      setTermHeight(h * 0.25);
    }
  }, []);

  // Global mouse handlers for dragging
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing || !rightRef.current) return;
      const { bottom } = rightRef.current.getBoundingClientRect();
      const newHeight = bottom - e.clientY;
      if (newHeight > MIN_TERMINAL_HEIGHT) {
        setTermHeight(newHeight);
      }
    };
    const onMouseUp = () => setIsResizing(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing]);

  // ─── Dark Mode State ──────────────────────────────────────────────────
  // Se inicia según la preferencia del sistema
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Actualiza el estado si la preferencia de color cambia en el sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  console.log("App renderizada correctamente");

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-content1">
      {/* Top Bar */}
      <Navbar maxWidth="full" className="border-b border-divider h-14">
        <NavbarBrand>
          <Icon icon="logos:robot-framework" className="text-2xl mr-2" />
          <p className="font-bold text-inherit">RoboCup SSL Developer</p>
        </NavbarBrand>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ConnectionStatus />
          {/* Botón para alternar el modo oscuro */}
          <Button
            size="sm"
            variant="bordered"
            className="ml-4"
            onPress={() => setDarkMode(!darkMode)}
            style={{ height: "28px" }}
            title={darkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
          >
            {darkMode ? (
              <Icon icon="lucide:sun" width="16" height="16" />
            ) : (
              <Icon icon="lucide:moon" width="16" height="16" />
            )}
          </Button>
        </div>
      </Navbar>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Card className="w-80 h-full rounded-none shadow-none border-r border-divider">
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              <div className="p-3 font-medium text-sm flex items-center">
                <Icon icon="lucide:cpu" className="mr-2" />
                Robot Data
              </div>
              <Divider />
              <RobotDataPanel robots={robots} />
            </div>
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
        <div ref={rightRef} className="flex-1 flex flex-col overflow-hidden">
          <FieldCodePanel
            robots={robots}
            ball={ball}
            code={code}
            setCode={setCode}
            filePath={filePath}
          />

          {/* Resize Handle */}
          <div
            className="h-1 bg-divider cursor-row-resize"
            onMouseDown={() => setIsResizing(true)}
          />

          {/* Terminal Panel */}
          <Card
            className="rounded-none shadow-none border-t border-divider overflow-hidden"
            style={{ height: termHeight }}
          >
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
