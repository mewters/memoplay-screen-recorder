import { globalShortcut, BrowserWindow } from 'electron';
import { createCanvasWindow, toggleCanvasWindow } from './canvasWindow';

let canvasWindow: BrowserWindow | null = null;

export const Shortcuts = {
    startCanvas: process.platform !== 'darwin' ? 'F8' : 'Command+Shift+1',
    play: process.platform !== 'darwin' ? 'F9' : 'Command+Shift+2',
    stop: process.platform !== 'darwin' ? 'F10' : 'Command+Option+2',
    setShortcuts(mainWindow: BrowserWindow) {
        globalShortcut.register(Shortcuts.play, () => {
            mainWindow.webContents.send('play');
        });
        globalShortcut.register(Shortcuts.stop, () => {
            mainWindow.webContents.send('stop');
        });
        globalShortcut.register(Shortcuts.startCanvas, toggleCanvasWindow);
    },
    unsetShortcuts() {
        globalShortcut.unregisterAll();
    },
};
