import { DataOperator, DataOperatorFetchOptions, SearchableItem, GlobalScope } from './data-operator';
import { spawn } from 'child_process';
import { ControlPanelIndexerService, defaultControlPanelIndexer } from 'main/services/control-panel/control-panel-indexer-service';

export class ControlPanelDataOperator implements DataOperator {
  constructor(private controlPanelIndexer: ControlPanelIndexerService) {}

  get pluginKey() {
    return 'controlPanelDataProvider';
  }

  get scope() {
    return GlobalScope;
  }

  async rebuildIndex() {
    await this.controlPanelIndexer.indexFiles();
  }

  async fetch(currentQuery?: string, options?: DataOperatorFetchOptions) {
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

export const defaultControlPanelDataOperator = new ControlPanelDataOperator(defaultControlPanelIndexer);
