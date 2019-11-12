import { BrowserWindow, Tray, Menu, app } from 'electron';
import { resolve, join } from 'path';
import { format as formatUrl } from 'url';
import { isDev, getAppVersion } from './main-utils';
import { uiConfig } from 'shared/ui-config';
import { cache } from './storage';
import { windows } from './windows';
import { sendCloseNotification } from './api';
import { applyRelevantSettings } from './settings-processing';

const isDevelopment = isDev();
const icon = resolve(__static, 'icon.png');
let mainTray: Tray | null = null;

function getSavedLocation() {
  return cache.get('windowLocation') || {};
}

function hideWindow(wnd: BrowserWindow) {
  wnd.hide();
  sendCloseNotification();
}

function initTray(refWindow: BrowserWindow) {
  const tray = new Tray(icon);
  tray.on('click', () => {
    refWindow.isVisible() ? hideWindow(refWindow) : refWindow.show();
  });
  const devVerSuffix = isDev() ? '--dev' : '';
  const trayMenu = Menu.buildFromTemplate([
    { label: `v.${getAppVersion()}${devVerSuffix}`, type: 'normal', enabled: false },
    { type: 'separator' },
    { label: 'Quit', type: 'normal', role: 'quit', click: () => app.quit() }
  ]);
  tray.setContextMenu(trayMenu);
  return tray;
}

function createMainWindowWithTray() {
  const winLocation = getSavedLocation();
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    useContentSize: false,
    transparent: true,
    icon: icon,
    width: uiConfig.appWidth,
    height: uiConfig.appIdleHeight,
    minHeight: uiConfig.appIdleHeight,
    resizable: false,
    ...winLocation
  });

  if (isDevelopment) {
    window.webContents.openDevTools({ mode: 'undocked' });
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    );
  }

  window.on('close', () => {
    const { x, y } = window!.getBounds();
    cache.set('windowLocation', { x, y });
  });

  window.on('closed', () => {
    windows.main = null; // TODO: remove side-effect
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
    hideWindow(window);
    sendCloseNotification();
  });

  window.on('blur', () => {
    if (!isDevelopment) {
      hideWindow(window);
      sendCloseNotification();
    }
  });

  const tray = initTray(window);
  return { window, tray };
}

export function initializeApp() {
  const initRes = createMainWindowWithTray();
  windows.main = initRes.window;
  mainTray = initRes.tray;
  applyRelevantSettings();
  return windows.main;
}

export function getMainWindow() {
  return windows.main!;
}
