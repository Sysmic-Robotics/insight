// src/global.d.ts
export {};

interface LuaFileNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: LuaFileNode[];
}

declare global {
  interface Window {
    api: {
      openLuaFile: () => Promise<{ content: string; path: string }>;
      saveLuaFileToPath: (filePath: string, content: string) => Promise<void>;
      selectLuaFolder: () => Promise<LuaFileNode[]>;
      readLuaFile: (path: string) => Promise<{ content: string; path: string }>;
    };
  }
}


