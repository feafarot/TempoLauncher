import Store, { Schema, Options } from 'electron-store';
import { getAppVersion } from 'main/main-utils';

export class LocalStorage<T> {
  private store: Store<T>;
  constructor(storeOptions: Options<T>) {
    // tslint:disable-next-line: no-any
    this.store = new Store<T>({ ...storeOptions, projectVersion: getAppVersion() } as any);
  }

  get<TKey extends keyof T>(key: TKey): T[TKey] {
    return this.store.get(key);
  }

  getFullObj() {
    return this.store.store;
  }

  set<TKey extends keyof T>(key: TKey, value: T[TKey]) {
    return this.store.set(key, value);
  }

  onDidChange<TKey extends keyof T>(
    key: TKey,
    callback: (newValue?: T[TKey], oldValue?: T[TKey]) => void) {
    return this.store.onDidChange(key, callback);
  }
}

export type StoreSchema<T> = { [P in keyof T]: Schema };
