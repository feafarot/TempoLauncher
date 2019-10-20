import Store, { Options } from 'electron-store';
import { LocalStorage, StoreSchema } from './local-storage-wrapper';
import { CurrentUserReplacementKey } from 'main/constants';
import { AppSettings, SettingsSearchPattern } from 'shared/app-settings';

export interface AppSettingsStore extends AppSettings {}

export class SettingsStorage extends LocalStorage<AppSettingsStore> { }

const defaultSettings: AppSettingsStore = {
  searchPatterns: [
    { pattern: 'C:/ProgramData/Microsoft/Windows/Start Menu/**/', extensions: 'exe,lnk,msc' },
    { pattern: `C:/Users/${CurrentUserReplacementKey}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/**/`, extensions: 'exe,lnk,msc' }
  ],
  launchHotkey: 'Super+Esc',
  launchOnSystemStartup: true
};

const appSettingsSchema: StoreSchema<AppSettingsStore> = {
  searchPatterns: {
    type: 'array',
    default: defaultSettings.searchPatterns,
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
  },
  launchOnSystemStartup: {
    type: 'boolean',
    default: defaultSettings.launchOnSystemStartup
  }
};

export const settingsStore: Options<AppSettingsStore> = ({
  name: '__tl-settings',
  accessPropertiesByDotNotation: false,
  schema: appSettingsSchema,
  migrations: {
    '0.4.0': (store) => {
      store.set('launchHotkey', 'Super+Esc');
    },
    '0.4.1': (store) => {
      // tslint:disable-next-line: no-any
      const prevPatterns = store.get('searchPatterms' as any) as SettingsSearchPattern[];
      if (prevPatterns && prevPatterns.length > 0) {
        store.set('searchPatterns', prevPatterns);
      }

      // tslint:disable-next-line: no-any
      store.delete('searchPatterms' as any);
      store.set('launchOnSystemStartup', true);
    }
  }
});
