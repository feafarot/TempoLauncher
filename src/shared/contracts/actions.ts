import { Action } from './helpers';
import { SearchRequest, SearchResponse } from './search';
import { LaunchRequest, LaunchResponse } from './launch';
import { ResizeRequest } from './resize';
import { GetSettingsResponse, SaveSettingsRequest } from './settings';

export const actions = {
  search: Action.create<SearchRequest, SearchResponse>('search'),
  launch: Action.create<LaunchRequest, LaunchResponse>('launch'),
  resize: Action.create<ResizeRequest, void>('resize'),
  minimize: Action.create<void, void>('minimize'),
  appMinimizedByBlur: Action.create<void, void>('appMinimizedByBlur'),
  getSettings: Action.create<void, GetSettingsResponse>('getSettings'),
  saveSettings: Action.create<SaveSettingsRequest, void>('saveSettings')
};
