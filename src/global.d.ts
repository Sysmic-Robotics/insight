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
      
      /**
       * Start the engine process
       * @param exePath Full path to the .exe
       * @param args Optional array of arguments
       */
      openEngine: (exePath: string, args?: string[]) => Promise<string>;

      /**
       * Stop the engine process
       */
      stopEngine: () => Promise<string>;

      /**
       * Listen to output streamed from engine's stdout/stderr
       * @param callback Callback that receives a string of terminal output
       */
      onTerminalOutput: (callback: (data: string) => void) => void;
      sendToEngine: (input: string) => Promise<string>;
    };
  }
}


