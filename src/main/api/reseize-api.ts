import { IpcMain } from 'electron';
import { createListener } from './utils';
import { actions } from 'shared/contracts/actions';
import { getMainWindow } from 'main/app-initializer';

export function initResizeApi(ipcMain: IpcMain) {
  createListener(ipcMain, actions.resize, async rq => {
    const win = getMainWindow();
    win.setMaximumSize(rq.width, rq.height);
    win.setSize(rq.width, rq.height);
  });
}
