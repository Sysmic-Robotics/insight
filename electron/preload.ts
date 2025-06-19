
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  // Lua
  openLuaFile: () => ipcRenderer.invoke("open-lua-file"),
  saveLuaFileToPath: (filePath: string, content: string) =>
    ipcRenderer.invoke("save-lua-file-to-path", filePath, content),
  selectLuaFolder: () => ipcRenderer.invoke("select-lua-folder"),
  readLuaFile: (filePath: string) => ipcRenderer.invoke("read-lua-file", filePath),
  
  // Engine
  openEngine: (exePath: string, args: string[] = []) =>
    ipcRenderer.invoke('start-engine', exePath, args),
  stopEngine: () =>
    ipcRenderer.invoke('stop-engine'),
  onTerminalOutput: (callback: (data: string) => void) =>
    ipcRenderer.on('terminal-output', (_event, data) => callback(data)),
});

