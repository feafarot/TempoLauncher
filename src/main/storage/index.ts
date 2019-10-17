import { SettingsStorage, settingsStore } from './settings';
import { AppCacheStorage, cacheStoreOptions } from './cache';

export const appSettings = new SettingsStorage(settingsStore);
export const cache = new AppCacheStorage(cacheStoreOptions);
