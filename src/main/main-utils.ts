import { createHash } from 'crypto';
import { BrowserWindow } from 'electron';

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
