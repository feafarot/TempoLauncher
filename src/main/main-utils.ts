import { createHash } from 'crypto';
import { BrowserWindow, app, App } from 'electron';
import packageJson from '../../package.json';

export function getHash(data: string) {
  return createHash('md5').update(data).digest('hex');
}

export function isDev() {
  return process.env.NODE_ENV !== 'production';
}

let mainWindowRef: BrowserWindow;
export const mainWindowInteractions = {
  init: (wnd: BrowserWindow) => {
    mainWindowRef = wnd;
  },
  hide() {
    mainWindowRef.hide();
  }
};

interface AppHack extends App {
  setAppPath(path: string): void;
  setVersion(ver: string): void;
}

export function getAppVersion() {
  return isDev()
    ? packageJson.version
    : app.getVersion();
}
