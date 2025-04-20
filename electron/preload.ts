/*import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    startBackend: () => ipcRenderer.invoke("start-backend"),
  },
});
*/
import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", {});
