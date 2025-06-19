import { app, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import * as fs from "fs";

let win: BrowserWindow; // Ensure this is properly initialized in your scope

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    autoHideMenuBar: true,
    title: "Insight CondorSSL",
    icon: path.join(__dirname, "../src/assets/insightLogo.ico"),
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

// Lua management ipc
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

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
let engine: ChildProcessWithoutNullStreams | null = null;
app.whenReady().then(() => {

  // ✅ Start the engine manually
  ipcMain.handle('start-engine', (_event, exePath: string, args: string[] = []) => {
    if (engine) return 'Engine is already running.';

    engine = spawn(exePath, args);

    engine.stdout.on('data', (data: Buffer) => {
      console.log('[ENGINE STDOUT]', data.toString()); // 👈 log it
      win.webContents.send('terminal-output', data.toString());
    });

    engine.stderr.on('data', (data: Buffer) => {
      console.log('[ENGINE STDOUT]', data.toString()); // 👈 log it
      win.webContents.send('terminal-output', `[stderr] ${data.toString()}`);
    });

    engine.on('close', (code: number) => {
      win.webContents.send('terminal-output', `\nEngine exited with code ${code}`);
      engine = null;
    });

    engine.on('error', (err: Error) => {
      console.log('[ENGINE STDOUT]', err.message.toString()); // 👈 log it
      win.webContents.send('terminal-output', `\nError: ${err.message}`);
      engine = null;
    });

    return 'Engine started.';
  });

  // ✅ Stop the engine manually
  ipcMain.handle('stop-engine', () => {
    if (!engine) return 'Engine is not running.';
    engine.kill();
    engine = null;
    return 'Engine stopped.';
  });

  ipcMain.handle('send-to-engine', (_event, input: string) => {
    if (engine && !engine.killed) {
      try {
        engine.stdin.write(input + '\n');
        return 'Command sent to engine.';
      } catch (err) {
        return 'Failed to send command: ' + (err as Error).message;
      }
    }
    return 'Engine is not running.';
  });
});