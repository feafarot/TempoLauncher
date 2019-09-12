import Store from 'electron-store';
import { defaultSettings, AppSettingsStore, SettingsStorage } from './settings';
import { defaultCache, AppCacheStore, AppCacheStorage } from './cache';

const settingsStore = new Store<AppSettingsStore>({
  name: 'settings',
  accessPropertiesByDotNotation: false,
  defaults: defaultSettings
});

const cacheStore = new Store<AppCacheStore>({
  name: 'cache',
  accessPropertiesByDotNotation: false,
  defaults: defaultCache
});

export const settings = new SettingsStorage(settingsStore);
export const cache = new AppCacheStorage(cacheStore);
