import { SearchQuery } from './search';

export interface LaunchRequest {
  targetId: string;
  queryObj: SearchQuery;
  source?: string;
}

export interface LaunchResponse {
  success: boolean;
  error?: string;
}
