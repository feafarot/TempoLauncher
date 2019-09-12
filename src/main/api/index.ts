import { ipcMain } from 'electron';
import { initSearchApi } from './search-api';
import { initLaunchApi } from './launch-api';

export function initializeApi() {
  initSearchApi(ipcMain);
  initLaunchApi(ipcMain);
}
