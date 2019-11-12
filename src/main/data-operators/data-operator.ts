export interface SearchableItem {
  displayText: string;
  value: string;
  secondaryText?: string;
  icon?: string;
}

export interface DataOperatorFetchOptions {
  rebuildCache?: boolean;
}

export const GlobalScope = Symbol('global_scope');

export interface DataOperator {
  readonly scope: string | Symbol;
  readonly pluginKey: string;
  readonly defaultItem?: SearchableItem;
  rebuildIndex?: () => void;
  fetch(currentQuery?: string, options?: DataOperatorFetchOptions): Promise<SearchableItem[]>;
  launch(value: string, query?: string): Promise<boolean>;
}

export interface DataOperatorRegistryItem {
  provider: DataOperator;
  name: string;
  isGlobal: boolean;
}

export function createRegistryItem(name: string, provider: DataOperator) {
  return {
    name,
    provider,
    isGlobal: provider.scope === GlobalScope
  };
}

export type DataOperatorsRegistry = DataOperatorRegistryItem[];
