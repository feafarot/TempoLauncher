import { ipcMain } from 'electron';
import { initSearchApi } from './search-api';

export function initializeApi() {
  initSearchApi(ipcMain);
}
