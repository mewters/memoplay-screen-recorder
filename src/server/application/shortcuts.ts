import { globalShortcut, BrowserWindow } from 'electron';

export const Shortcuts = {
    play: process.platform !== 'darwin' ? 'F9' : 'Command+Shift+2',
    stop: process.platform !== 'darwin' ? 'F10' : 'Command+Option+2',
    setShortcuts(mainWindow: BrowserWindow) {
        globalShortcut.register(Shortcuts.play, () => {
            mainWindow.webContents.send('play');
        });
        globalShortcut.register(Shortcuts.stop, () => {
            mainWindow.webContents.send('stop');
        });
    },
    unsetShortcuts() {
        globalShortcut.unregisterAll();
    },
};
