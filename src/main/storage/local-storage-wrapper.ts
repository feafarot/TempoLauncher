import Store from 'electron-store';

export class LocalStorage<T> {
  constructor(private store: Store<T[keyof T]>) {}

  get<TKey extends keyof T>(key: TKey): T[TKey] {
    return (this.store.get((key as unknown) as string) as unknown) as T[TKey];
  }

  set<TKey extends keyof T>(key: TKey, value: T[TKey]) {
    return this.store.set((key as unknown) as string, value);
  }
}
