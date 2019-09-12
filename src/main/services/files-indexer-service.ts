import { SettingsStorage } from 'main/storage/settings';
import { AppCacheStorage, FileInfo } from 'main/storage/cache';
import { globby } from 'shared/utils/import-normalize';
import { extractIcons } from 'main/icon-extractor';
import { basename, extname, dirname } from 'path';
import { cache, settings } from 'main/storage';

const fileNotFoundIconResponse = '--FNF--';

export class FileIndexerService {
  private _indexingInProgress = false;
  private memoryFilesCache: FileInfo[] | null = null;

  constructor(private cacheStorage: AppCacheStorage, private settingsStorage: SettingsStorage) {
  }

  private get pattergs() {
    return this.settingsStorage.get('searchPatterms').map(x => `${x.pattern}*.{${x.extensions}}`);
  }

  private updateCache(data: FileInfo[]) {
    this.cacheStorage.set('files', data);
    this.memoryFilesCache = data;
  }

  private getFromCache() {
    if (!this.memoryFilesCache) {
      this.memoryFilesCache = this.cacheStorage.get('files');
    }

    return this.memoryFilesCache;
  }

  get indexingInProgress() {
    return this._indexingInProgress;
  }

  async indexFiles() {
    this._indexingInProgress = true;
    const files = await globby(this.pattergs);
    const icons = await extractIcons(files);
    const preparedCache = files
      .map<FileInfo>((x, i) => {
        const ext = extname(x);
        return {
          fullPath: x,
          fileName: basename(x).replace(new RegExp(`\\${ext}$`), ''),
          dirName: dirname(x),
          extension: ext,
          base64Icon: icons[i]
        };
      })
      .filter(x => x.base64Icon !== fileNotFoundIconResponse);
    this.updateCache(preparedCache);
    this._indexingInProgress = false;
    return preparedCache;
  }

  async getFiles(forceReindex: boolean = false) {
    let files = this.getFromCache();
    if (forceReindex || files == null || files.length === 0) {
      files = await this.indexFiles();
    }

    return files;
  }
}

export const fileIndexer = new FileIndexerService(cache, settings);
