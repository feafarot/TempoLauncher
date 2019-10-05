import { SettingsStorage, settingsStore } from './settings';
import { AppCacheStorage, cacheStoreOptions } from './cache';

export const settings = new SettingsStorage(settingsStore);
export const cache = new AppCacheStorage(cacheStoreOptions);
