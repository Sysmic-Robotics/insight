import { app, BrowserWindow } from "electron";
import * as path from "path";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,        // ✅ Prevents resizing
    autoHideMenuBar: true, // ✅ Hides the menu bar,
    title: "CondorSSL", // ✅ Set title here
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged; // ✅ Detect dev mode automatically

  if (isDev) {
    win.loadURL("http://localhost:5173");
    //win.webContents.openDevTools(); // 🧪 Enable debugging
  }
  else {
    win.loadFile(path.join(__dirname, "../dist/index.html")); // Production build
  }
}

app.whenReady().then(createWindow);
