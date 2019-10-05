import { BrowserWindow, Tray, Menu, app } from 'electron';
import { resolve, join } from 'path';
import { format as formatUrl } from 'url';
import { isDev } from './main-utils';
import { uiConfig } from 'shared/ui-config';
import { cache } from './storage';

const isDevelopment = isDev();
const icon = resolve(__static, 'icon.png');
let mainWindow: BrowserWindow | null = null;
let mainTray: Tray | null = null;

function getSavedLocation() {
  return cache.get('windowLocation') || {};
}

function initTray(refWindow: BrowserWindow) {
  const tray = new Tray(icon);
  tray.on('click', () => {
    refWindow.isVisible() ? refWindow.hide() : refWindow.show();
  });
  const trayMenu = Menu.buildFromTemplate([
    { label: `v.${app.getVersion()}`, type: 'normal', enabled: false },
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
    const { x, y } = mainWindow!.getBounds();
    cache.set('windowLocation', { x, y });
  });

  window.on('closed', () => {
    mainWindow = null; // TODO: remove sideeffect
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
    if (!isDevelopment) {
      window.hide();
    }
  });

  const tray = initTray(window);
  return { window, tray };
}

export function initializeApp() {
  const initRes = createMainWindowWithTray();
  mainWindow = initRes.window;
  mainTray = initRes.tray;
  return mainWindow;
}

export function getMainWindow() {
  return mainWindow!;
}
