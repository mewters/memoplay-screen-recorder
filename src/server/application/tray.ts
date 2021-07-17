import { Tray as ElectronTray, Menu, BrowserWindow, ipcMain } from 'electron';
import { FileHandlers } from '../handlers/fileHandlers';
import { Shortcuts } from './shortcuts';

const trayDefaultIcon = FileHandlers.getAssetPath(
        'tray-icons/tray-icon-stroke.png'
    ),
    trayRecordingIcon = FileHandlers.getAssetPath(
        'tray-icons/tray-icon-red.png'
    ),
    trayPausedIcon = FileHandlers.getAssetPath(
        'tray-icons/tray-icon-white.png'
    );

function getDefaultMenu(mainWindow: BrowserWindow) {
    return Menu.buildFromTemplate([
        {
            label: `Start Recording      ${Shortcuts.play}`,
            click: () => mainWindow.webContents.send('play'),
        },
        // { label: 'Convert Videos', click: () => convertVideoList() },
        { type: 'separator' },
        { label: 'Quit', role: 'quit' },
    ]);
}

function getRecordingMenu(mainWindow: BrowserWindow) {
    return Menu.buildFromTemplate([
        {
            label: `Pause/Resume Recording      ${Shortcuts.play}`,
            click: () => mainWindow.webContents.send('play'),
        },
        {
            label: `Stop Recording              ${Shortcuts.stop}`,
            click: () => mainWindow.webContents.send('stop'),
        },
        // { type: 'separator' },
        // {
        //     label: `Cancel Recording`,
        //     click: () => mainWindow.webContents.send('delete'),
        // },
    ]);
}

interface TrayProps {
    tray: ElectronTray | null;
    start(mainWindow: BrowserWindow): void;
}

export const Tray: TrayProps = {
    tray: null,
    start(mainWindow: BrowserWindow) {
        Tray.tray = new ElectronTray(trayDefaultIcon);
        Tray.tray.setToolTip('MemoPlay');
        Tray.tray.setContextMenu(getDefaultMenu(mainWindow));

        ipcMain.on('win:start', () => {
            if (Tray.tray !== null) {
                Tray.tray.setContextMenu(getRecordingMenu(mainWindow));
                Tray.tray.setImage(trayRecordingIcon);
            }
        });
        ipcMain.on('win:pause', () => {
            if (Tray.tray !== null) {
                Tray.tray.setContextMenu(getRecordingMenu(mainWindow));
                Tray.tray.setImage(trayPausedIcon);
            }
        });
        ipcMain.on('win:resume', () => {
            if (Tray.tray !== null) {
                Tray.tray.setContextMenu(getRecordingMenu(mainWindow));
                Tray.tray.setImage(trayRecordingIcon);
            }
        });
        ipcMain.on('win:stop', () => {
            if (Tray.tray !== null) {
                Tray.tray.setContextMenu(getDefaultMenu(mainWindow));
                Tray.tray.setImage(trayDefaultIcon);
            }
        });
    },
};
