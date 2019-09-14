import { DataOperatorsRegistry } from './data-operator';
import { filesDataProvider } from './files-data-operator';

export const dataOperatorsRegistry: DataOperatorsRegistry = [
  { name: 'filesDataOperator', provider: filesDataProvider }
];
