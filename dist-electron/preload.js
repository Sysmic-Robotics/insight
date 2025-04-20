"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    startBackend: () => ipcRenderer.invoke("start-backend"),
  },
});
*/
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {});
//# sourceMappingURL=preload.js.map