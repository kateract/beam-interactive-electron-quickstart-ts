import { app, BrowserWindow } from 'electron'
import * as url from 'url';
import * as path from 'path';
import { OauthClient } from './plugin/oauthClient'

declare var __dirname, process;

let win;

let createWindow = () => {
    win = new BrowserWindow({ width: 800, height: 900 });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (win === null) createWindow();
});