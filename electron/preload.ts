
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  openLuaFile: () => ipcRenderer.invoke("open-lua-file"),
  saveLuaFileToPath: (filePath: string, content: string) =>
    ipcRenderer.invoke("save-lua-file-to-path", filePath, content),
  selectLuaFolder: () => ipcRenderer.invoke("select-lua-folder"),
  readLuaFile: (filePath: string) => ipcRenderer.invoke("read-lua-file", filePath),
});

