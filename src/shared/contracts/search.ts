export interface SearchRequest {
  query: string;
  prefix?: string;
}

export interface SearchResponse {
  items: {
    display?: string;
    value?: string;
    icon?: string;
  }[];
}
