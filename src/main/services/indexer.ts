import { createControlledPromise } from 'shared/utils';

type IndexBuilder<T> = () => Promise<T[]>;

export class Indexer<T> {
  private indexingProgressPromise: Promise<void> | null = null;
  private inMemoryCache: T[] | null = null;

  constructor(
    private indexBuilder: IndexBuilder<T>,
    private saveCache: (data: T[]) => Promise<void>,
    private getCache: () => Promise<T[]>) {
    this.getCache().then(initCache => {
      this.inMemoryCache = initCache;
    });
  }

  async indexData() {
    const [promise, resolveProgress,] = createControlledPromise<void>();
    this.indexingProgressPromise = promise;
    const preparedCache = await this.indexBuilder();
    this.updateCache(preparedCache);
    this.indexingProgressPromise = null;
    resolveProgress();
    return preparedCache;
  }

  async getData(forceReindex: boolean = false) {
    if (this.indexingProgressPromise) {
      await this.indexingProgressPromise;
    }

    let data = await this.getFromCache();
    if (forceReindex || data == null || data.length === 0) {
      data = await this.indexData();
    }

    return data;
  }

  private async getFromCache() {
    if (!this.inMemoryCache) {
      this.inMemoryCache = await this.getCache();
    }

    return this.inMemoryCache;
  }

  private async updateCache(data: T[]) {
    await this.saveCache(data);
    this.inMemoryCache = data;
  }
}
