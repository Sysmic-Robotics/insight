import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

let win: BrowserWindow | null;
let splash: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: true,
    autoHideMenuBar: true,
    title: "Insight CondorSSL",
    icon: path.join(__dirname, "../src/assets/insightLogo.ico"),
    show: false, // Don't show the main window yet
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "../dist-electron/preload.js"),
    },
  });

  splash = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, "../src/assets/insightLogo.ico"),
  });

  splash.loadFile(path.join(__dirname, "splash.html"));

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  win.once("ready-to-show", () => {
    if (splash) {
      splash.destroy();
    }
    win?.show();
  });

  win.on("closed", () => {
    win = null;
  });
}

app.whenReady().then(createWindow);

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
let engine: ChildProcessWithoutNullStreams | null = null;
app.whenReady().then(() => {

  // ✅ Start the engine manually
  ipcMain.handle('start-engine', (_event, exePath: string, args: string[] = []) => {
    if (engine) return 'Engine is already running.';

    engine = spawn(exePath, args);

    engine.stdout.on('data', (data: Buffer) => {
      if (win) {
        console.log('[ENGINE STDOUT]', data.toString()); // 👈 log it
        win.webContents.send('terminal-output', data.toString());
      }
    });

    engine.stderr.on('data', (data: Buffer) => {
      if (win) {
        console.log('[ENGINE STDOUT]', data.toString()); // 👈 log it
        win.webContents.send('terminal-output', `[stderr] ${data.toString()}`);
      }
    });

    engine.on('close', (code: number) => {
      if (win) {
        console.log('[ENGINE STDOUT]', `Engine exited with code ${code}`); // 👈 log it
        win.webContents.send('terminal-output', `\nEngine exited with code ${code}`);
      }
      engine = null;
    });

    engine.on('error', (err: Error) => {
      if (win) {
        console.log('[ENGINE STDOUT]', err.message.toString()); // 👈 log it
        win.webContents.send('terminal-output', `\nError: ${err.message}`);
      }
      engine = null;
    });

    return 'Engine started.';
  });

  // Stop the engine manually
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