import { app, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import * as fs from "fs";

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

// ✅ Open Lua file
ipcMain.handle("open-lua-file", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Lua files", extensions: ["lua"] }],
    properties: ["openFile"]
  });

  if (canceled || filePaths.length === 0) return { content: "", path: "" };

  const path = filePaths[0];
  const content = fs.readFileSync(path, "utf-8");

  return { content, path };
});


// ✅ Save Lua file
ipcMain.handle("save-lua-file-to-path", async (_event, filePath: string, content: string) => {
  fs.writeFileSync(filePath, content, "utf-8");
});


function readFolderRecursive(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.map((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return {
        name: entry.name,
        type: "folder",
        path: fullPath,
        children: readFolderRecursive(fullPath)
      };
    } else if (entry.isFile() && entry.name.endsWith(".lua")) {
      return {
        name: entry.name,
        type: "file",
        path: fullPath
      };
    }
  }).filter(Boolean);
}

ipcMain.handle("select-lua-folder", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });

  if (canceled || filePaths.length === 0) return [];

  const tree = readFolderRecursive(filePaths[0]);
  return tree;
});

ipcMain.handle("read-lua-file", async (_e, filePath: string) => {
  const content = fs.readFileSync(filePath, "utf-8");
  return { content, path: filePath };
});
