import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { spawn, exec } from "child_process";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    autoHideMenuBar: true,
    title: "CondorSSL",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "../dist-electron/preload.js"),
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
    win.webContents.on("did-fail-load", (_e, code, desc, validatedURL) => {
      console.error("❌ Page failed to load:", { code, desc, validatedURL });
    });
  }
}

app.whenReady().then(createWindow);

/*
ipcMain.handle("start-backend", () => {
  const backendPath = "C:/Robocup/CondorSSL/build/SysmicSoftware.exe";

  console.log("🟡 Launching backend via cmd start...");

  spawn("cmd.exe", ["/c", "start", `"Backend"`, backendPath], {
    windowsHide: false,
  });
});
*/
