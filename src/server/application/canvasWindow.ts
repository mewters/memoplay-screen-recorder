import path from 'path';
import { app, BrowserWindow, shell, screen } from 'electron';

let canvasWindow: BrowserWindow | null = null;
let isCanvasWindowHidden = false;

// if (
//     process.env.NODE_ENV === 'development' ||
//     process.env.DEBUG_PROD === 'true'
// ) {
//     require('electron-debug')();
// }

export function toggleCanvasWindow() {
    console.log(151561, canvasWindow);
    if (canvasWindow) {
        if (isCanvasWindowHidden) {
            canvasWindow.show();
            canvasWindow.focus();
        } else {
            canvasWindow.hide();
        }
        isCanvasWindowHidden = !isCanvasWindowHidden;
        // canvasWindow.close();
        // canvasWindow.destroy();
        // canvasWindow = null;
    } else {
        createcanvasWindow();
    }
}

export async function createcanvasWindow() {
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

    canvasWindow = new BrowserWindow({
        // width: 400,
        // height: 400,
        // x: externalDisplay.bounds.x + 50,
        // y: externalDisplay.bounds.y + 50,
        frame: false,
        transparent: true,
        kiosk: true,
        alwaysOnTop: true,
        thickFrame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            // devTools: false,
        },
    });
    canvasWindow.loadURL(`file://${__dirname}/../../index.html?page=canvas`);
    // canvasWindow.setIgnoreMouseEvents(true);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    canvasWindow.webContents.on('did-finish-load', () => {
        if (!canvasWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            canvasWindow.minimize();
        } else {
            canvasWindow.show();
            canvasWindow.focus();
        }
    });

    canvasWindow.setMenu(null);

    canvasWindow.on('closed', () => {
        // Shortcuts.unsetShortcuts();
        // canvasWindow = null;
    });

    // const menuBuilder = new MenuBuilder(mainWindow);
    // menuBuilder.buildMenu();

    // Open urls in the user's browser
    canvasWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
}
