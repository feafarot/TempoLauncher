export interface SearchRequest {
  query: string;
  prefix?: string;
}

export interface DataItem {
  display?: string;
  value?: string;
  icon?: string;
}

export interface SearchResponse {
  items: DataItem[];
}
