import { AppCacheStorage, ControlPanelItemInfo } from 'main/storage/cache';
import { extractIcons } from 'main/icon-extractor';
import Registry from 'winreg';
import { createControlledPromise } from 'shared/utils';
import { cache, } from 'main/storage';
import { Indexer } from '../indexer';
import controlPanelEntriesJson from './control-panel-entries.json';

const cacheStorageKey = 'controlPanelEntries';

type ControlPanelEntry = {
  name: string,
  canonicalName: string,
  guid: string,
  module: string,
  iconPath?: string
};

export class ControlPanelIndexerService {
  private indexer: Indexer<ControlPanelItemInfo>;

  constructor(private cacheStorage: AppCacheStorage, private controlPanelEntries: ControlPanelEntry[]) {
    this.indexer = new Indexer<ControlPanelItemInfo>(
      async () => {
        const entries = await this.fetchIconsDefaultPaths();
        const icons = await extractIcons(entries.map(x => x.iconPath || x.module));
        return entries.map<ControlPanelItemInfo>((x, i) => ({
          name: x.name,
          canonicalName: x.canonicalName,
          guid: x.guid,
          base64Icon: icons[i] || undefined
        }));
      },
      async data => this.cacheStorage.set(cacheStorageKey, data),
      async () => this.cacheStorage.get(cacheStorageKey)
    );
  }

  private async fetchIconsDefaultPaths() {
    const result = await Promise.all(this.controlPanelEntries.map(x => {
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

  async indexFiles() {
    return await this.indexer.indexData();
  }

  async getCPItems(forceReindex: boolean = false) {
    return await this.indexer.getData(forceReindex);
  }
}

export const defaultControlPanelIndexer = new ControlPanelIndexerService(cache, controlPanelEntriesJson);
