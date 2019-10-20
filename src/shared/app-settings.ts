export interface SettingsSearchPattern {
  pattern: string;
  extensions: string;
}

export interface AppSettings {
  searchPatterns: SettingsSearchPattern[];
  launchHotkey: string;
  launchOnSystemStartup: boolean;
}
