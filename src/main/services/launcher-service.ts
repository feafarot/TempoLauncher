import { searchIdHelper } from './search-id-helper';
import { dataOperatorsRegistry } from 'main/data-providers/providers-registry';

export class LauncherService {
  async launch(id: string) {
    const parsedId = searchIdHelper.parseId(id);
    const operator = dataOperatorsRegistry.find(x => x.name === parsedId.provider);
    if (!operator) {
      throw new Error(`Unknown provider ${parsedId.provider}`);
    }

    await operator.provider.launch(parsedId.value);
  }
}

export const launcerService = new LauncherService();
