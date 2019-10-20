import { DataOperator, DataOperatorFetchOptions, SearchableItem } from './data-operator';
import { spawn } from 'child_process';
import { ControlPanelIndexerService, defaultControlPanelIndexer } from 'main/services/control-panel/control-panel-indexer-service';

export class ControlPanelDataProvider implements DataOperator {
  constructor(private controlPanelIndexer: ControlPanelIndexerService) {}

  reIndex() {
    this.controlPanelIndexer.indexFiles();
  }

  async fetch(options?: DataOperatorFetchOptions) {
    const controlPanelItems = await this.controlPanelIndexer.getCPItems(options && options.rebuildCache);
    return controlPanelItems.map<SearchableItem>((x, i) => {
      return {
        displayText: x.name,
        secondaryText: `Control Panel > ${x.name}`,
        value: x.canonicalName,
        icon: x.base64Icon
      };
    });
  }

  async launch(value: string) {
    spawn(`control.exe /name "${value}"`, { shell: true });
    return true;
  }
}

export const defaultControlPanelDataProvider = new ControlPanelDataProvider(defaultControlPanelIndexer);
