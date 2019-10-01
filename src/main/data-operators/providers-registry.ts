import { DataOperatorsRegistry } from './data-operator';
import { filesDataProvider } from './files-data-operator';
import { defaultControlPanelDataProvider } from './control-panel-data-operator';

export const dataOperatorsRegistry: DataOperatorsRegistry = [
  { name: 'filesDataOperator', provider: filesDataProvider },
  { name: 'controlPanelDataProvider', provider: defaultControlPanelDataProvider }
];
