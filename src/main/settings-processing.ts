import AutoLaunch from 'auto-launch';
import { appSettings } from './storage';
import { isDev } from './main-utils';

const launcher = new AutoLaunch({ name: 'TempoLauncher' });

function switchLauncher(enabled: boolean) {
  if (enabled) {
    launcher.isEnabled().then(currentlyEnabled => {
      if (!currentlyEnabled) {
        launcher.enable();
      }
    });
  } else {
    launcher.disable();
  }
}

function applyStartupSettings() {
  if (appSettings.get('launchOnSystemStartup')) {
    switchLauncher(true);
  }

  appSettings.onDidChange('launchOnSystemStartup', enabled => {
    if (enabled) {
      switchLauncher(enabled);
    }
  });
}

export function applyRelevantSettings() {
  if (!isDev()) { // Production only settings
    applyStartupSettings();
  }
}
