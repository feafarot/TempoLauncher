import Store from 'electron-store';
import { defaultSettings, AppSettingsStore, SettingsStorage } from './settings';
import { defaultCache, AppCacheStore, AppCacheStorage } from './cache';

type AsStore<T> = T[keyof T];

const settingsStore = new Store<AsStore<AppSettingsStore>>({
  name: 'settings',
  accessPropertiesByDotNotation: false,
  // tslint:disable-next-line: no-any
  defaults: defaultSettings as any
});

const cacheStore = new Store<AsStore<AppCacheStore>>({
  name: 'cache',
  accessPropertiesByDotNotation: false,
  // tslint:disable-next-line: no-any
  defaults: defaultCache as any
});

export const settings = new SettingsStorage(settingsStore);
export const cache = new AppCacheStorage(cacheStore);
