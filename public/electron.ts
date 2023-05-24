import * as path from "path";
import * as url from "url";

import { app, BrowserWindow } from "electron";
import * as isDev from "electron-is-dev";

const baseUrl: string = "http://localhost:3000";

let mainWindow: BrowserWindow | null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    // 일반 크기 윈도우
    width: 1080,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    // autoHideMenuBar: true,

    // 전체화면으로 사용할 때
    // alwaysOnTop: true,
    // center: true,
    // fullscreen: true,
    // kiosk: !isDev,
    // resizable: false,
    // autoHideMenuBar: true,
    // webPreferences: {
    //   nodeIntegration: true,
    // },
  });
  
  const mainWindowUrl: string = url.pathToFileURL(path.join(__dirname, '../build/index.html')).toString();

  mainWindow.loadURL(isDev ? baseUrl : mainWindowUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", (): void => {
    mainWindow = null;
  });
}

app.on("ready", (): void => {
  createMainWindow();
});

app.on("window-all-closed", (): void => {
  app.quit();
});

app.on("activate", (): void => {
  if (mainWindow === null) {
    createMainWindow();
  }
});