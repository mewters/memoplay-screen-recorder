/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// import MenuBuilder from './menu';

import { Tray } from './server/application/tray';
import './server/application/events';
import { Shortcuts } from './server/application/shortcuts';

async function createOtherWindow() {
    if (
        process.env.NODE_ENV === 'development' ||
        process.env.DEBUG_PROD === 'true'
    ) {
        await installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../assets');

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    // let displays = screen.getAllDisplays();
    // let externalDisplay = displays.find((display) => {
    //     return display.bounds.x !== 0 || display.bounds.y !== 0;
    // });

    // if (externalDisplay) {
    //     win = new BrowserWindow({
    //         x: externalDisplay.bounds.x + 50,
    //         y: externalDisplay.bounds.y + 50,
    //     });
    //     win.loadURL('https://github.com');

    let otherWindow: BrowserWindow | null = new BrowserWindow({
        // width: 400,
        // height: 400,
        // x: externalDisplay.bounds.x + 50,
        // y: externalDisplay.bounds.y + 50,
        frame: false,
        transparent: true,
        kiosk: true,
        // alwaysOnTop: true,
        thickFrame: false,
        // resizable: false,
        webPreferences: {
            nodeIntegration: true,
            // devTools: false,
        },
    });
    otherWindow.loadURL(`file://${__dirname}/index.html?page=canvas`);
    // otherWindow.setIgnoreMouseEvents(true);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    otherWindow.webContents.on('did-finish-load', () => {
        if (!otherWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            otherWindow.minimize();
        } else {
            otherWindow.show();
            otherWindow.focus();
        }
    });

    otherWindow.setMenu(null);

    otherWindow.on('closed', () => {
        Shortcuts.unsetShortcuts();
        otherWindow = null;
    });

    // const menuBuilder = new MenuBuilder(mainWindow);
    // menuBuilder.buildMenu();

    // Open urls in the user's browser
    otherWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
}

export default class AppUpdater {
    constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
) {
    require('electron-debug')();
}

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload
        )
        .catch(console.log);
};

const createWindow = async () => {
    if (
        process.env.NODE_ENV === 'development' ||
        process.env.DEBUG_PROD === 'true'
    ) {
        await installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../assets');

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    mainWindow = new BrowserWindow({
        show: false,
        width: 510,
        height: 240,
        resizable: !app.isPackaged,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    mainWindow.webContents.on('did-finish-load', () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    mainWindow.setMenu(null);

    mainWindow.on('closed', () => {
        Shortcuts.unsetShortcuts();
        mainWindow = null;
    });

    // const menuBuilder = new MenuBuilder(mainWindow);
    // menuBuilder.buildMenu();

    // Open urls in the user's browser
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    Shortcuts.setShortcuts(mainWindow);
    Tray.start(mainWindow);

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    // new AppUpdater();

    createOtherWindow();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});
