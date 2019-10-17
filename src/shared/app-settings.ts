export interface SettingsSearchPattern {
  pattern: string;
  extensions: string;
}

export interface AppSettings {
  searchPatterms: SettingsSearchPattern[];
  launchHotkey: string;
}
