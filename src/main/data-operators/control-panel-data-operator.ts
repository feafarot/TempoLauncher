import { DataOperator, DataOperatorFetchOptions, SearchableItem } from './data-operator';
import controlPanelEntries from './control-panel-entries.json';
import { extractIcons } from 'main/icon-extractor';
import { spawn } from 'child_process';
import Registry from 'winreg';
import { createControlledPromise } from 'shared/utils';
import { error, info } from 'electron-log';

type ControlPanelEntry = {
  name: string;
  canonicalName: string;
  guid: string;
  module: string;
  iconPath?: string;
};

export class ControlPanelDataProvider implements DataOperator {
  constructor() {}

  private async fetchIconsDefaultPaths() {
    const result = await Promise.all(controlPanelEntries.map(x => {
      const key = new Registry({ hive: Registry.HKCR, key: `\\CLSID\\{${x.guid}}\\DefaultIcon` });
      const [promise, resolve, reject] = createControlledPromise<ControlPanelEntry>();
      key.get(Registry.DEFAULT_VALUE, (err, res) => {
        if (err) {
          //info(`'${key.key}' was not found in the registry. Fallbacking to module path.`);
          resolve(x);
          return;
        }

        resolve({ ...x, iconPath: res.value.startsWith('$(') ? undefined : res.value });
      });

      return promise;
    }));
    return result;
  }

  async fetch(options?: DataOperatorFetchOptions) {
    const cpe = await this.fetchIconsDefaultPaths();
    const icons = await extractIcons(cpe.map(x => x.iconPath || x.module));
    return controlPanelEntries.map<SearchableItem>((x, i) => {
      return {
        displayText: x.name,
        value: x.canonicalName,
        icon: icons[i] || undefined
      };
    });
    // return [];
  }

  async launch(value: string) {
    spawn(`control.exe /name "${value}"`, { shell: true });
    return true;
  }
}

export const defaultControlPanelDataProvider = new ControlPanelDataProvider();
