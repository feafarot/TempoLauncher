import { createControlledPromise } from 'shared/utils';

type IndexBuilder<T> = () => Promise<T[]>;

export class Indexer<T> {
  private indexingProgressPromise: Promise<void> | null = null;
  private inMemoryCache: T[] | null = null;

  constructor(
    private indexBuilder: IndexBuilder<T>,
    private saveCache: (data: T[]) => Promise<void>,
    private getCache: () => Promise<T[]>) {
  }

  async indexData() {
    const [promise, resolveProgress, reject] = createControlledPromise<void>();
    this.indexingProgressPromise = promise;
    const preparedCahce = await this.indexBuilder();
    this.updateCache(preparedCahce);
    this.indexingProgressPromise = null;
    resolveProgress();
    return preparedCahce;
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
