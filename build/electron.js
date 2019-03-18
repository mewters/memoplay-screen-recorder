const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const shortcuts = {
  play: process.platform !== 'darwin' ? 'F9' : 'Command+Shift+2',
  stop: process.platform !== 'darwin' ? 'F10' : 'Command+Option+2'
}

let mainWindow
const startUrl = process.env.ELECTRON_START_URL || url.format({
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
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(startUrl);

  if(startUrl.includes('http')){
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
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