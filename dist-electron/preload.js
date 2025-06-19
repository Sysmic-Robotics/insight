"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
    // Lua
    openLuaFile: () => electron_1.ipcRenderer.invoke("open-lua-file"),
    saveLuaFileToPath: (filePath, content) => electron_1.ipcRenderer.invoke("save-lua-file-to-path", filePath, content),
    selectLuaFolder: () => electron_1.ipcRenderer.invoke("select-lua-folder"),
    readLuaFile: (filePath) => electron_1.ipcRenderer.invoke("read-lua-file", filePath),
    // Engine
    openEngine: (exePath, args = []) => electron_1.ipcRenderer.invoke('start-engine', exePath, args),
    stopEngine: () => electron_1.ipcRenderer.invoke('stop-engine'),
    onTerminalOutput: (callback) => electron_1.ipcRenderer.on('terminal-output', (_event, data) => callback(data)),
});
//# sourceMappingURL=preload.js.map