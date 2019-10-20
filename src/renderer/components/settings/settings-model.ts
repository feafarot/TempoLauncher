import * as yup from 'yup';
import { AppSettings, SettingsSearchPattern } from 'shared/app-settings';

export const WindowsButtonKey = 'Super';

export type SettingsModel = {
  searchPatterns: SettingsSearchPattern[];
  launchHotkeySequence: string[];
  hotkeyWithWinKey: boolean;
  launchOnSystemStartup: boolean;
};

export function createModel(settings: AppSettings): SettingsModel {
  const hotkeyParts = settings.launchHotkey.split('+');
  const winKeyIndex = hotkeyParts.findIndex(x => x === WindowsButtonKey);
  const hasWinKey = winKeyIndex >= 0;
  if (hasWinKey) {
    hotkeyParts.splice(winKeyIndex, 1);
  }

  return {
    hotkeyWithWinKey: hasWinKey,
    launchHotkeySequence: hotkeyParts,
    searchPatterns: [...settings.searchPatterns],
    launchOnSystemStartup: settings.launchOnSystemStartup
  };
}

function normalizePatterns(patterns: SettingsSearchPattern[]) {
  return patterns.map<SettingsSearchPattern>(x => {
    return {
      extensions: x.extensions,
      pattern: x.pattern
        .replace(/\\\\/g, '/')
        .replace(/\\/g, '/')
        .trim()
    };
  });
}

export function createSettingsFromModel(model: SettingsModel): AppSettings {
  return {
    launchHotkey: `${model.hotkeyWithWinKey ? WindowsButtonKey + '+' : ''}${model.launchHotkeySequence.join('+')}`,
    searchPatterns: normalizePatterns(model.searchPatterns),
    launchOnSystemStartup: model.launchOnSystemStartup
  };
}
