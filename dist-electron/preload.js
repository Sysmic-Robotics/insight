"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
    // Engine
    openEngine: (exePath, args = []) => electron_1.ipcRenderer.invoke('start-engine', exePath, args),
    stopEngine: () => electron_1.ipcRenderer.invoke('stop-engine'),
    sendToEngine: (input) => electron_1.ipcRenderer.invoke('send-to-engine', input),
    onTerminalOutput: (callback) => electron_1.ipcRenderer.on('terminal-output', (_event, data) => callback(data)),
});
//# sourceMappingURL=preload.js.map