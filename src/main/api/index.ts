import { ipcMain } from 'electron';
import { initSearchApi } from './search-api';
import { initLaunchApi } from './launch-api';
import { initResizeApi } from './reseize-api';

export function initializeApi() {
  initSearchApi(ipcMain);
  initLaunchApi(ipcMain);
  initResizeApi(ipcMain);
}
