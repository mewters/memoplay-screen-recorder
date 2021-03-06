const {app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, dialog} = require('electron');
const path = require('path');
const url = require('url');
const isDev = process.argv.includes('--dev');//require('electron-is-dev');

const shortcuts = {
  play: process.platform !== 'darwin' ? 'F9' : 'Command+Shift+2',
  stop: process.platform !== 'darwin' ? 'F10' : 'Command+Option+2'
}

let mainWindow,
  tray;

const appIcon = path.join(__dirname, '/../img/icons/mp-logo-128.png'),
  trayDefaultIcon = path.join(__dirname, '/../img/icons/tray-icon-stroke.png'),
  trayRecordingIcon = path.join(__dirname, '/../img/icons/tray-icon-red.png'),
  trayPausedIcon = path.join(__dirname, '/../img/icons/tray-icon-white.png'),
  trayDefaultMenu = Menu.buildFromTemplate([
    { label: `Start Recording      ${shortcuts.play}`, click: () => mainWindow.webContents.send('play') },
    { label: 'Convert Videos', click: () => convertVideoList() },
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
    width: 510,
    height: 240,
    minWidth: 510,
    minHeight: 240,
    resizable: isDev,
    icon: appIcon,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(startUrl);

  if(isDev){
    mainWindow.webContents.openDevTools();
  }else{
    mainWindow.webContents.on("devtools-opened", () => { mainWindow.webContents.closeDevTools(); });
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

ipcMain.on('win:convert-video', async (event, args) => {
  const {folder, fileName, type} = args,
    input = `${folder}/${fileName}`;

  try{
    await convertVideo(input, type);
  
    require('fs').unlink(input, () => {});
    event.sender.send('back:convert-video:complete');

  }catch(error){
    console.log('Convertion Error: ', error);
  }
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


async function selectVideos(){
  let types = [ {name: 'Movies', extensions: ['webm', 'avi', 'mp4']} ],
    options = {filters:types, properties:["multiSelections","openFile"]},
    files = dialog.showOpenDialog(options);
  return files;
}

async function convertVideoList(format = 'mp4'){
  try{
    const filesList = await selectVideos();
    await Promise.all(filesList.map((file, index) => convertVideo(file, format, index, filesList.length)));
    console.log('finish all')
  }catch(error){
    console.log('ERROR: ', error)
  }
}

async function convertVideo(input, format, index = 0, total = 0){
  const hbjs = require('handbrake-js'),
    output =  `${input.replace(/\.webm$/i, '.')}${format}`;
  return new Promise((resolve, reject) => {
    hbjs.spawn({ input , output })
      .on('error', err => {
        console.log('error on converting');
        reject();
      })
      .on('begin', progress => {
        console.time(input);
        if(total){
          console.log(`start: ${index + 1}/${total} - `, input);
        }
      })
      .on('progress', progress => {
        //console.log(input,cprogress)
      })
      .on('end', err => {
        if(total){
          console.log(`end: ${index + 1}/${total} - `, input);
        }else{
          console.log('end:' , input)
        }
        console.timeEnd(input);
        resolve();
      })
  })
}