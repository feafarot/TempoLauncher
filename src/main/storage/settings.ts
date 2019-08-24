import { LocalStorage } from './local-storage-wrapper';

export interface AppSettingsStore {
  searchPatterms: {
    pattern: string;
    extensions: string;
  }[];
}

export class SettingsStorage extends LocalStorage<AppSettingsStore> { }

export const defaultSettings: AppSettingsStore = {
  searchPatterms: [
    { pattern: 'C:/ProgramData/Microsoft/Windows/Start Menu/**/', extensions: 'exe,lnk,msc' }
  ]
};
