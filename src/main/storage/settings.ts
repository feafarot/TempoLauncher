import { LocalStorage } from './local-storage-wrapper';
import { CurrentUserReplacementKey } from 'main/constants';

export interface AppSettingsStore {
  searchPatterms: {
    pattern: string;
    extensions: string;
  }[];
}

export class SettingsStorage extends LocalStorage<AppSettingsStore> { }

export const defaultSettings: AppSettingsStore = {
  searchPatterms: [
    { pattern: 'C:/ProgramData/Microsoft/Windows/Start Menu/**/', extensions: 'exe,lnk,msc' },
    { pattern: `C:/Users/${CurrentUserReplacementKey}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/**/`, extensions: 'exe,lnk,msc' }
  ]
};
