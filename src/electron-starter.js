const {app, BrowserWindow, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');

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
    width: 450,
    height: 170,
    minWidth: 450,
    minHeight: 170,
    webPreferences: {
      nodeIntegration: true
    }
  });

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