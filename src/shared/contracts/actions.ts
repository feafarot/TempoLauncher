import { Action } from './helpers';
import { SearchRequest, SearchResponse } from './search';
import { LaunchRequest, LaunchResponse } from './launch';
import { ResizeRequest } from './resize';

export const actions = {
  search: Action.create<SearchRequest, SearchResponse>('search'),
  launch: Action.create<LaunchRequest, LaunchResponse>('launch'),
  resize: Action.create<ResizeRequest, void>('resize')
};
