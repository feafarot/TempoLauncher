import { createListener } from './utils';
import { IpcMain } from 'electron';
import { actions } from 'shared/contracts/actions';
import { appSettings } from 'main/storage';
import { AppSettings } from 'shared/app-settings';

export function initSettingsApi(ipcMain: IpcMain) {
  createListener(ipcMain, actions.getSettings, async _ => {
    const settings = appSettings.getFullObj();
    return { settings };
  });

  createListener(ipcMain, actions.saveSettings, async rq => {
    Object.keys(rq.settings).forEach(x => {
      const key = <keyof AppSettings>x;
      appSettings.set(key, rq.settings[key]);
    });
  });
}
