import { ipcMain, BrowserWindow, shell } from 'electron';
import { electronOauth2 } from 'electron-oauth2';
import JsonnDB = require('node-json-db');
import * as url from 'url';
import * as path from 'path';

const db = new JsonnDB("./data/GameData", true, false);
const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false
    }
};
export class OauthClient {
    constructor() {
        ipcMain.on('oauthRequest', (event, scopes) => {
            this.oauthRequest(scopes)
                .then((token) => event.sender.send('oauthRequestApproved', token),
                err => event.sender.send('oauthRequestRejected', err)
                );

        });
    }

    public oauthRequest(scopes): Promise<this> {
        return new Promise((resolve, reject) => {
            this.getOauthClient()
                .then(authInfo => {
                    const oauth2 = electronOauth2(authInfo, windowParams);

                    this.getRefreshTokenFromDB(scopes)
                        .then(token => {
                            oauth2.refreshToken(token.refresh_token)
                                .then(token => {
                                    db.push("/" + scopes, token, true);
                                    resolve(token);
                                }, err => { reject(err); });
                        }, err => {
                            oauth2.getAccessToken({ scope: scopes })
                                .then(token => {
                                    db.push("/" + scopes, token, true);
                                    resolve(token);
                                }, err => {
                                    reject(err);
                                });
                        });
                }, reason => { console.log("Error processing oauth request: ", reason.message); });
        });
    }

    public getOauthClient() {
        return new Promise<IOauthClientInfo>((resolve, reject) => {
            try {
                var client = db.getData("/OauthAuthentication")
                if (client.clientId && client.clientSecret) {
                    resolve(client);
                    return;
                } 
            } catch (error) {

            }
            this.createOauthClientConfigurationWindow().then(client => resolve(client), err => reject(err));
        })
    }

    public getRefreshTokenFromDB(scopes): Promise<IOauthAuthenticationDetail> {
        return new Promise((resolve, reject) => {
            try {
                var token = db.getData("/" + scopes)
                if (token.refresh_token) {
                    resolve(token);
                    return;
                }
            } catch (err) {
                console.log(err.message);
            }
            reject(Error('No Refresh Token Saved'));

        })
    }

    public createOauthClientConfigurationWindow(): Promise<IOauthClientInfo> {
        return new Promise((resolve, reject) => {
            var data: IOauthClientInfo = {
                clientId: "",
                clientSecret: "",
                authorizationUrl: "https://mixer.com/oauth/authorize",
                tokenUrl: "https://mixer.com/api/v1/oauth/token",
                useBasicAuthorizationHeader: false,
                redirectUri: "http://localhost",
            }

            var oauthWindow = new BrowserWindow({ width: 800, height: 600 });
            oauthWindow.setMenuBarVisibility(false);
            oauthWindow.on('will-navigate', (e, url) => {
                e.preventDefault();
                shell.openExternal(url);
            })

            oauthWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'oauth.html'),
                protocol: 'file',
                slashes: true
            }))

            oauthWindow.on('closed', () => {
                oauthWindow = null;
                ipcMain.removeListener('setOauthClientInfo', setData);
                if (data && data.clientId && data.clientId.length > 0 && data.clientSecret && data.clientSecret.length > 0)
                    resolve(data);
                else
                    reject(Error('Invalid Client Data'));
            })

            var setData = function(event, details) {
                data.clientId = details.id;
                data.clientSecret = details.secret;
                db.push('/OauthAuthentication', data)
                oauthWindow.close();
            }
            ipcMain.on('setOauthClientInfo', setData);
        })
    }

}

export interface IOauthClientInfo {
    clientId: string,
    clientSecret: string,
    authorizationUrl: string,
    tokenUrl: string,
    useBasicAuthorizationHeader: boolean,
    redirectUri: string
}

export interface IOauthAuthenticationDetail {
    access_token: string,
    refresh_token: string,

}