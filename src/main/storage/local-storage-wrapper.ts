import Store, { Schema, Options } from 'electron-store';
import { app } from 'electron';

export class LocalStorage<T> {
  private store: Store<T>;
  constructor(storeOptions: Options<T>) {
    // tslint:disable-next-line: no-any
    this.store = new Store<T>({ ...storeOptions, projectVersion: app.getVersion() } as any);
  }

  get<TKey extends keyof T>(key: TKey): T[TKey] {
    return this.store.get(key);
  }

  set<TKey extends keyof T>(key: TKey, value: T[TKey]) {
    return this.store.set(key, value);
  }
}

export type StoreSchema<T> = { [P in keyof T]: Schema };
