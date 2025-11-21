"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
let win;
let splash;
function createWindow() {
    win = new electron_1.BrowserWindow({
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
    splash = new electron_1.BrowserWindow({
        width: 400,
        height: 300,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        icon: path.join(__dirname, "../src/assets/insightLogo.ico"),
    });
    splash.loadFile(path.join(__dirname, "splash.html"));
    const isDev = !electron_1.app.isPackaged;
    if (isDev) {
        win.loadURL("http://localhost:5173");
    }
    else {
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
electron_1.app.whenReady().then(createWindow);
const child_process_1 = require("child_process");
let engine = null;
electron_1.app.whenReady().then(() => {
    // ✅ Start the engine manually
    electron_1.ipcMain.handle('start-engine', (_event, exePath, args = []) => {
        if (engine)
            return 'Engine is already running.';
        engine = (0, child_process_1.spawn)(exePath, args);
        engine.stdout.on('data', (data) => {
            if (win) {
                console.log('[ENGINE STDOUT]', data.toString()); // 👈 log it
                win.webContents.send('terminal-output', data.toString());
            }
        });
        engine.stderr.on('data', (data) => {
            if (win) {
                console.log('[ENGINE STDOUT]', data.toString()); // 👈 log it
                win.webContents.send('terminal-output', `[stderr] ${data.toString()}`);
            }
        });
        engine.on('close', (code) => {
            if (win) {
                console.log('[ENGINE STDOUT]', `Engine exited with code ${code}`); // 👈 log it
                win.webContents.send('terminal-output', `\nEngine exited with code ${code}`);
            }
            engine = null;
        });
        engine.on('error', (err) => {
            if (win) {
                console.log('[ENGINE STDOUT]', err.message.toString()); // 👈 log it
                win.webContents.send('terminal-output', `\nError: ${err.message}`);
            }
            engine = null;
        });
        return 'Engine started.';
    });
    // Stop the engine manually
    electron_1.ipcMain.handle('stop-engine', () => {
        if (!engine)
            return 'Engine is not running.';
        engine.kill();
        engine = null;
        return 'Engine stopped.';
    });
    electron_1.ipcMain.handle('send-to-engine', (_event, input) => {
        if (engine && !engine.killed) {
            try {
                engine.stdin.write(input + '\n');
                return 'Command sent to engine.';
            }
            catch (err) {
                return 'Failed to send command: ' + err.message;
            }
        }
        return 'Engine is not running.';
    });
});
//# sourceMappingURL=main.js.map