import { ipcMain, IpcMain } from 'electron';
import { initSearchApi } from './search-api';
import { initLaunchApi } from './launch-api';
import { initUtilApi } from './util-api';
import { createRequestSender } from './utils';
import { actions } from 'shared/contracts/actions';
import { initSettingsApi } from './settings-api';

export function initializeApi() {
  initSearchApi(ipcMain);
  initLaunchApi(ipcMain);
  initUtilApi(ipcMain);
  initSettingsApi(ipcMain);
}

export const sendCloseNotification = createRequestSender(ipcMain, 'main', actions.appMinimizedByBlur);
