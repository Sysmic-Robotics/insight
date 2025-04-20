// src/global.d.ts
export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        startBackend: () => Promise<void>;
      };
    };
  }
}
