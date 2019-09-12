import Store from 'electron-store';

export class LocalStorage<T> {
  constructor(private store: Store<T>) {}

  get<TKey extends keyof T>(key: TKey): T[TKey] {
    return this.store.get(key);
  }

  set<TKey extends keyof T>(key: TKey, value: T[TKey]) {
    return this.store.set(key, value);
  }
}
