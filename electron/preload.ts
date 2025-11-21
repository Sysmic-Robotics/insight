
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  
  // Engine
  openEngine: (exePath: string, args: string[] = []) =>
    ipcRenderer.invoke('start-engine', exePath, args),
  stopEngine: () =>
    ipcRenderer.invoke('stop-engine'),
  sendToEngine: (input: string) =>
    ipcRenderer.invoke('send-to-engine', input),
  onTerminalOutput: (callback: (data: string) => void) =>
    ipcRenderer.on('terminal-output', (_event, data) => callback(data)),
});

