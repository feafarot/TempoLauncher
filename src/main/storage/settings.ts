import Store, { Options } from 'electron-store';
import { LocalStorage, StoreSchema } from './local-storage-wrapper';
import { CurrentUserReplacementKey } from 'main/constants';
import { Schema } from 'electron-store';

interface SearchPattern {
  pattern: string;
  extensions: string;
}

export interface AppSettingsStore {
  searchPatterms: SearchPattern[];
}

export class SettingsStorage extends LocalStorage<AppSettingsStore> { }

const defaultSettings: AppSettingsStore = {
  searchPatterms: [
    { pattern: 'C:/ProgramData/Microsoft/Windows/Start Menu/**/', extensions: 'exe,lnk,msc' },
    { pattern: `C:/Users/${CurrentUserReplacementKey}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/**/`, extensions: 'exe,lnk,msc' }
  ]
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
  }
};

export const settingsStore: Options<AppSettingsStore> = ({
  name: '__tl-settings',
  accessPropertiesByDotNotation: false,
  schema: appSettingsSchema,
  migrations: {}
});
