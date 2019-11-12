import { DataOperatorsRegistry, createRegistryItem } from './data-operator';
import { filesDataOperator } from './files-data-operator';
import { defaultControlPanelDataOperator } from './control-panel-data-operator';
import { defaultCmdDataOperator } from './cmd-data-operator';

export const dataOperatorsRegistry: DataOperatorsRegistry = [
  createRegistryItem(filesDataOperator.pluginKey, filesDataOperator),
  createRegistryItem(defaultControlPanelDataOperator.pluginKey, defaultControlPanelDataOperator),
  createRegistryItem(defaultCmdDataOperator.pluginKey, defaultCmdDataOperator)
];

export function rebuildAllIndexes() {
  dataOperatorsRegistry.forEach(x => {
    if (x.provider.rebuildIndex) {
      x.provider.rebuildIndex();
    }
  });
}
