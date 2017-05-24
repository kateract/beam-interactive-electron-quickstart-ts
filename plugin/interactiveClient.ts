import * as interactive from 'beam-interactive-node2';
import { ws } from 'ws';
import JsonDB = require('node-json-db');
import * as fs from 'fs';
import { ipcMain, BrowserWindow, shell } from 'electron';
import { Game } from '../game';
import * as url from 'url';
import * as path from 'path';
var db = new JsonDB("./data/GameData", true, false);

interactive.setWebSocket('ws');

const client = new interactive.GameClient();

client.on('error', (err) => console.log('error:', err));
ipcMain.on('connectInteractive', (event, token) => { connectInteractive(event.sender, token) });

function connectInteractive(requestor, token) {
    getGameVersionFromDB().then(version => {
        openGameConnection(requestor, version, token);
    }, err => {
        requestVersionID(requestor, token);
    });
};

function openGameConnection(requestor, version, authToken) {

    client.open({
        authToken: authToken,
        versionId: version
    })
        .then(() => client.synchronizeScenes())
        .then(() => client.ready(true))
        .then(() => { var game = new Game(client, requestor); game.initializeGame(); });
}

function requestVersionID(requestor, token) {
    var versionWindow = new BrowserWindow({ width: 600, height: 300 });
    versionWindow.setMenuBarVisibility(false);
    versionWindow.on('will-navigate', (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
    });
    versionWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'version.html'),
        protocol: 'file',
        slashes: true
    }))
    versionWindow.on('closed', () => {
        versionWindow = null;
    })

    ipcMain.on('setVersionInfo', (event, versionID) => {
        var data = { version: versionID };
        db.push('/GameVersion', data, true);
        versionWindow.close(),
            openGameConnection(event, versionID, token);
    })

}

function getGameVersionFromDB(): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            var data = db.getData("/GameVersion")
            if (data.version) {
                resolve(data.version);
            } else {
                reject(new Error(data.error));
            }
        } catch (err) {
            reject(new Error(err));
        }
    })
}