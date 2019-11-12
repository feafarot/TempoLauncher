import { TextMatch } from 'shared/utils/util-types';

export interface SearchRequest {
  queryObj: SearchQuery;
  rebuildCache?: boolean;
}

export interface SearchQuery {
  query: string;
  pluginKey?: string;
}

export interface DataItem {
  id: string;
  display: string;
  secondaryText?: string;
  value?: string;
  icon?: string;
  matches?: TextMatch[];
  isPluginSelector?: boolean;
}

export interface SearchResponse {
  items: DataItem[];
  mathEvalResult?: string;
}
