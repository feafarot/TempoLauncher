import { SettingsStorage } from 'main/storage/settings';
import { AppCacheStorage, FileInfo } from 'main/storage/cache';
import { globby } from 'shared/utils/import-normalize';
import { extractIcons } from 'main/icon-extractor';
import { basename, extname, dirname } from 'path';
import { cache, appSettings } from 'main/storage';
import { CurrentUserReplacementKey } from 'main/constants';
import { userInfo } from 'os';
import { Indexer } from './indexer';

const cacheStorageKey = 'files';

export class FileIndexerService {
  private indexer: Indexer<FileInfo>;

  constructor(private cacheStorage: AppCacheStorage, private settingsStorage: SettingsStorage) {
    this.indexer = new Indexer<FileInfo>(
      async () => {
        const files = await globby(this.patterns, { suppressErrors: true });
        const icons = await extractIcons(files);
        const data = files.map<FileInfo>((x, i) => {
          const ext = extname(x);
          return {
            fullPath: x,
            fileName: basename(x).replace(new RegExp(`\\${ext}$`), ''),
            dirName: dirname(x),
            extension: ext,
            base64Icon: icons[i] || undefined
          };
        });
        return data;
      },
      async data => this.cacheStorage.set(cacheStorageKey, data),
      async () => this.cacheStorage.get(cacheStorageKey));
  }

  private get patterns() {
    const userName = userInfo().username;
    return this.settingsStorage
      .get('searchPatterms')
      .map(x => `${x.pattern.replace(CurrentUserReplacementKey, userName)}*.{${x.extensions}}`);
  }

  async indexFiles() {
    return await this.indexer.indexData();
  }

  async getFiles(forceReindex: boolean = false) {
    return await this.indexer.getData(forceReindex);
  }
}

export const fileIndexer = new FileIndexerService(cache, appSettings);
