import Store from 'electron-store';
import { AppSettingsStore, SettingsStorage, settingsStore } from './settings';
import { AppCacheStore, AppCacheStorage, cacheStoreOptions } from './cache';

export const settings = new SettingsStorage(settingsStore);
export const cache = new AppCacheStorage(cacheStoreOptions);
