import { IpcMain } from 'electron';
import { createListener } from './utils';
import { actions } from 'shared/contracts/actions';
import { getMainWindow } from 'main/app-initializer';

export function initUtilApi(ipcMain: IpcMain) {
  createListener(ipcMain, actions.resize, async rq => {
    const win = getMainWindow();
    const contentBounds = win.getContentBounds();
    win.setContentBounds({ ...contentBounds, height: rq.height });
    win.setSize(rq.width, rq.height);
  });

  createListener(ipcMain, actions.minimize, async () => {
    const win = getMainWindow();
    win.hide();
  });
}
