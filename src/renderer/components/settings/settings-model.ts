import * as yup from 'yup';
import { AppSettings, SettingsSearchPattern } from 'shared/app-settings';

export const WindowsButonKey = 'Super';

export type SettingsModel = {
  searchPatterms: SettingsSearchPattern[];
  launchHotkeySequence: string[];
  hotkeyWithWinKey: boolean;
};

export function createModel(settings: AppSettings): SettingsModel {
  const hotkeyParts = settings.launchHotkey.split('+');
  const winKeyIndex = hotkeyParts.findIndex(x => x === WindowsButonKey);
  const hasWinKey = winKeyIndex >= 0;
  if (hasWinKey) {
    hotkeyParts.splice(winKeyIndex, 1);
  }

  return {
    hotkeyWithWinKey: hasWinKey,
    launchHotkeySequence: hotkeyParts,
    searchPatterms: [...settings.searchPatterms]
  };
}

export function createSettingsFromModel(model: SettingsModel): AppSettings {
  return {
    launchHotkey: `${model.hotkeyWithWinKey ? WindowsButonKey + '+' : ''}${model.launchHotkeySequence.join('+')}`,
    searchPatterms: model.searchPatterms
  };
}
