#!/usr/bin/env node
const {app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu} = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const shortcuts = {
  play: process.platform !== 'darwin' ? 'F9' : 'Command+Shift+2',
  stop: process.platform !== 'darwin' ? 'F10' : 'Command+Option+2'
}

let mainWindow,
  tray;

const trayDefaultIcon = path.join(__dirname, '/../img/icons/tray-icon-stroke.png'),
  trayRecordingIcon = path.join(__dirname, '/../img/icons/tray-icon-red.png'),
  trayPausedIcon = path.join(__dirname, '/../img/icons/tray-icon-white.png'),
  trayDefaultMenu = Menu.buildFromTemplate([
    { label: `Start Recording      ${shortcuts.play}`, click: () => mainWindow.webContents.send('play') },
    { type: 'separator' },
    { label: 'Quit', role: 'quit' }
  ]),
  trayRecordingMenu = Menu.buildFromTemplate([
    { label: `Pause/Resume Recording      ${shortcuts.play}`, click: () => mainWindow.webContents.send('play') },
    { label: `Stop Recording              ${shortcuts.stop}`, click: () => mainWindow.webContents.send('stop') },
    { type: 'separator' },
    { label: `Cancel Recording`, click: () => mainWindow.webContents.send('delete') }
  ]);

const startUrl = isDev ? 'http://localhost:3000' : url.format({
  pathname: path.join(__dirname, '/../build/index.html'),
  protocol: 'file:',
  slashes: true
});

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 230,
    minWidth: 500,
    minHeight: 230,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(startUrl);

  if(isDev){
    mainWindow.webContents.openDevTools();
  }
  createTray();

  mainWindow.on('closed', () => {
    mainWindow = null;
    tray.destroy();
    tray = null;
  })

  setShortcuts();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  //if (process.platform !== 'darwin') {
    app.quit();
  //}
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
})

app.on('will-quit', () => {
  unsetShortcuts();
})

function setShortcuts(){
  
  globalShortcut.register(shortcuts.play, () => {
    mainWindow.webContents.send('play');
  })
  globalShortcut.register(shortcuts.stop, () => {
    mainWindow.webContents.send('stop');
  })
  
}

function createTray(){
  tray = new Tray(trayDefaultIcon);
  tray.setToolTip('MemoPlay');
  tray.setContextMenu(trayDefaultMenu);
}

function unsetShortcuts(){
  globalShortcut.unregisterAll();
}

ipcMain.on('win:convert-video', (event, args) => {
  const hbjs = require('handbrake-js'),
    {folder, fileName, type} = args,
    input = `${folder}/${fileName}`,
    output =  `${folder}/${fileName.replace(/\.webm$/i, '.')}${type}`;

  hbjs.spawn({ input , output })
    .on('error', err => {
      console.log('error on converting');
    })
    .on('end', err => {
      require('fs').unlink(input, () => {});
      event.sender.send('back:convert-video:complete');
    })
})

ipcMain.on('win:start', () => {
  tray.setContextMenu(trayRecordingMenu);
  tray.setImage(trayRecordingIcon);
})
ipcMain.on('win:pause', () => {
  tray.setContextMenu(trayRecordingMenu);
  tray.setImage(trayPausedIcon);  
})
ipcMain.on('win:resume', () => {
  tray.setContextMenu(trayRecordingMenu);
  tray.setImage(trayRecordingIcon);  
})
ipcMain.on('win:stop', () => {
  tray.setContextMenu(trayDefaultMenu);
  tray.setImage(trayDefaultIcon);
})
ipcMain.on('win:cancel', () => {
  tray.setContextMenu(trayDefaultMenu);
  tray.setImage(trayDefaultIcon);
})