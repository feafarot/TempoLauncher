import { SearchRequest, SearchResponse } from './search';
import { Action } from './helpers';

export const actions = {
  search: Action.create<SearchRequest, SearchResponse>('search')
};
