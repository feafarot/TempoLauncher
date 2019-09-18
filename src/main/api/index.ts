import { ipcMain, IpcMain } from 'electron';
import { initSearchApi } from './search-api';
import { initLaunchApi } from './launch-api';
import { initUtilApi } from './util-api';

export function initializeApi() {
  initSearchApi(ipcMain);
  initLaunchApi(ipcMain);
  initUtilApi(ipcMain);
}
