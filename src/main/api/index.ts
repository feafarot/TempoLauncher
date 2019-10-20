import { ipcMain } from 'electron';
import { initSearchApi } from './search-api';
import { initLaunchApi } from './launch-api';
import { initUtilApi } from './util-api';
import { createRequestSender } from './utils';
import { actions } from 'shared/contracts/actions';
import { initSettingsApi } from './settings-api';
import { info } from 'electron-log';

export function initializeApi() {
  initSearchApi(ipcMain);
  initLaunchApi(ipcMain);
  initUtilApi(ipcMain);
  initSettingsApi(ipcMain);
}

export const sendCloseNotification = createRequestSender(ipcMain, 'main', actions.appMinimizedByBlur);

if (module.hot) {
  module.hot.accept(['./search-api', './launch-api', './util-api', './settings-api'], () => {
    ipcMain.eventNames().forEach(x => ipcMain.removeAllListeners(x as string));
    initializeApi();
  });
}
