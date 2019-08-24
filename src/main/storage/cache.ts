import { LocalStorage } from './local-storage-wrapper';

export interface FileInfo {
  fullPath: string;
  dirName: string;
  fileName: string;
  extension: string;
  base64Icon?: string;
}

export interface AppCacheStore {
  files: FileInfo[];
}

export class AppCacheStorage extends LocalStorage<AppCacheStore> { }

export const defaultCache: AppCacheStore = {
  files: []
};
