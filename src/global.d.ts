// src/global.d.ts
export {};

declare global {
  interface Window {
    api: {
      openLuaFile: () => Promise<{ content: string; path: string }>;
      saveLuaFileToPath: (filePath: string, content: string) => Promise<void>;
    };
  }
}

