import { BrowserWindow, ipcMain } from 'electron';
import * as interactive from 'beam-interactive-node2';


export class Game {
    client: interactive.GameClient;
    window: Electron.BrowserWindow;
    constructor(client: interactive.GameClient, window: Electron.BrowserWindow ) {
        this.client = client;
        this.window = window;
    }
    public initializeGame(){
        
    }
}