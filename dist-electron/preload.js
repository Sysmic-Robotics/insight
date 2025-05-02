"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("api", {
    openLuaFile: () => electron_1.ipcRenderer.invoke("open-lua-file"),
    saveLuaFileToPath: (filePath, content) => electron_1.ipcRenderer.invoke("save-lua-file-to-path", filePath, content),
});
//# sourceMappingURL=preload.js.map