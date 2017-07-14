'use strict';
import { IInteractiveHost } from './IInteractiveHost';
import { InteractiveHost} from './InteractiveHost';
const electron : Electron.ElectronMainAndRenderer = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;

var mainWindow : Electron.BrowserWindow = null;
var interactiveHost : IInteractiveHost = null;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  interactiveHost = new InteractiveHost(); 

  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () =>  {
    mainWindow = null;
  });
});

ipcMain.on('GetInteractiveHost', (event, arg) => {
  event.sender.send("InteractiveHostCreated", interactiveHost);
})