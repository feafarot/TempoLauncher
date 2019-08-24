import { TextMatch } from 'shared/utils/util-types';

export interface SearchRequest {
  query: string;
  prefix?: string;
}

export interface DataItem {
  display: string;
  value?: string;
  icon?: string;
  matches?: TextMatch[];
}

export interface SearchResponse {
  items: DataItem[];
  mathEvalResult?: string;
}
