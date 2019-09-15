import { app, BrowserWindow, Tray } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { initializeApi } from './api';
import { resolve } from 'path';
import { isDev } from './main-utils';
import unhandled from 'electron-unhandled';

unhandled();

app.commandLine.appendSwitch('remote-debugging-port', '9228');

const isDevelopment = isDev();
const icon = resolve(__static, 'icon.png');
// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    frame: false,
    useContentSize: true,
    transparent: true,
    icon: icon,
    width: 600
  });

  if (isDevelopment) {
    window.webContents.openDevTools({ mode: 'undocked' });
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    );
  }

  window.on('closed', () => {
    mainWindow = null;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  // tslint:disable-next-line: no-any
  window.on('minimize', (e: any) => {
    e.preventDefault();
    window.hide();
  });

  window.on('blur', () => {
    //window.hide();
  });

  tray = new Tray(icon);
  tray.on('click', () => {
    window.isVisible() ? window.hide() : window.show();
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  initializeApi();
  mainWindow = createMainWindow();
});
