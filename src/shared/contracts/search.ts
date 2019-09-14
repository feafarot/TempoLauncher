import { TextMatch } from 'shared/utils/util-types';

export interface SearchRequest {
  query: string;
  prefix?: string;
  rebuildCache?: boolean;
}

export interface DataItem {
  id: string;
  display: string;
  value?: string;
  icon?: string;
  matches?: TextMatch[];
}

export interface SearchResponse {
  items: DataItem[];
  mathEvalResult?: string;
}
