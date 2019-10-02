export interface SearchableItem {
  displayText: string;
  value: string;
  secondaryText?: string;
  icon?: string;
}

export interface DataOperatorFetchOptions {
  rebuildCache?: boolean;
}

export interface DataOperator {
  fetch(options?: DataOperatorFetchOptions): Promise<SearchableItem[]>;
  launch(value: string): Promise<boolean>;
}

export interface DataOperatorRegistryItem {
  provider: DataOperator;
  name: string;
}

export type DataOperatorsRegistry = DataOperatorRegistryItem[];
