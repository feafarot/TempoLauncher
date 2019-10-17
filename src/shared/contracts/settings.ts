import { AppSettings } from 'shared/app-settings';

export interface GetSettingsResponse {
  settings: AppSettings;
}

export interface SaveSettingsRequest {
  settings: AppSettings;
}
