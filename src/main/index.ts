import { app, BrowserWindow, Tray, globalShortcut, Menu } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { initializeApi } from './api';
import { resolve } from 'path';
import { isDev, mainWindowInteractions } from './main-utils';
import unhandled from 'electron-unhandled';
import { getMainWindow, initializeApp } from './app-initializer';

unhandled();

app.commandLine.appendSwitch('remote-debugging-port', '9228');

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
  initializeApi();
  const window = initializeApp();
  mainWindowInteractions.init(window);
  globalShortcut.register('Super+Esc', () => {
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
