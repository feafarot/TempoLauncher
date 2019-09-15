import { LocalStorage } from './local-storage-wrapper';

export interface FileInfo {
  fullPath: string;
  dirName: string;
  fileName: string;
  extension: string;
  base64Icon?: string;
}

export interface ResultLaunchStats {
  [id: string]: ResultItemLaunchStat;
}

export interface ResultItemLaunchStat {
  launchCount: number;
  /** In milliseconds */
  lastLaunchDate?: number;
}

export interface AppCacheStore {
  files: FileInfo[];
  launchStats: ResultLaunchStats;
}

export class AppCacheStorage extends LocalStorage<AppCacheStore> { }

export const defaultCache: AppCacheStore = {
  files: [],
  launchStats: {}
};
