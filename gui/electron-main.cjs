const { app, BrowserWindow } = require('electron');
const path = require('path');
// No longer need electron-is-dev package

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "IP Codemaker Agent | Desktop Console",
    backgroundColor: '#0b0e14',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    autoHideMenuBar: true,
  });

  // Load the web app URL. 
  // We use the Vite port (3000) for development.
  const isDev = !app.isPackaged;
  const startUrl = isDev 
    ? 'http://localhost:3006' 
    : `file://${path.join(__dirname, '../build/index.html')}`;

  win.loadURL(startUrl);

  // If in dev mode, open the dev tools automatically
  if (isDev) {
    // win.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
