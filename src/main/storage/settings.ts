import Store, { Options } from 'electron-store';
import { LocalStorage, StoreSchema } from './local-storage-wrapper';
import { CurrentUserReplacementKey } from 'main/constants';
import { AppSettings } from 'shared/app-settings';

export interface AppSettingsStore extends AppSettings {}

export class SettingsStorage extends LocalStorage<AppSettingsStore> { }

const defaultSettings: AppSettingsStore = {
  searchPatterms: [
    { pattern: 'C:/ProgramData/Microsoft/Windows/Start Menu/**/', extensions: 'exe,lnk,msc' },
    { pattern: `C:/Users/${CurrentUserReplacementKey}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/**/`, extensions: 'exe,lnk,msc' }
  ],
  launchHotkey: 'Super+Esc'
};

const appSettingsSchema: StoreSchema<AppSettingsStore> = {
  searchPatterms: {
    type: 'array',
    default: defaultSettings.searchPatterms,
    items: {
      type: 'object',
      required: ['pattern', 'extensions'],
      properties: {
        pattern: { type: 'string' },
        extensions: { type: 'string' }
      }
    }
  },
  launchHotkey: {
    type: 'string',
    default: defaultSettings.launchHotkey
  }
};

export const settingsStore: Options<AppSettingsStore> = ({
  name: '__tl-settings',
  accessPropertiesByDotNotation: false,
  schema: appSettingsSchema,
  migrations: {
    '0.4.0': (store) => {
      store.set('launchHotkey', 'Super+Esc');
    }
  }
});
