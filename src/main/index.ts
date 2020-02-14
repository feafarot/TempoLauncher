import { app, globalShortcut } from 'electron';
import { initializeApi } from './api';
import { isDev, mainWindowInteractions } from './main-utils';
import unhandled from 'electron-unhandled';
import { getMainWindow, initializeApp } from './app-initializer';
import { info, catchErrors } from 'electron-log';
import { appSettings } from './storage';

if (!isDev()) {
}
else {
  app.commandLine.appendSwitch('remote-debugging-port', '9228');
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
  if (getMainWindow() === null) {
    initializeApp();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  info('Initializing API...');
  initializeApi();
  info('Initializing main window...');
  const window = initializeApp();
  mainWindowInteractions.init(window);
  globalShortcut.register(appSettings.get('launchHotkey'), () => {
    if (window) {
      if (!window.isVisible()) {
        window.show();
        window.focus();
      } else {
        window.hide();
      }
    }
  });
});

catchErrors({ showDialog: true });
if (isDev()) {
  unhandled();
}

if (module.hot) {
  module.hot.accept();
}
