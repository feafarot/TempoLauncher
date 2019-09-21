import { searchIdHelper } from './search-id-helper';
import { dataOperatorsRegistry } from 'main/data-operators/providers-registry';
import { ScoringService, scoringService } from './scoring-service';
import { mainWindowInteractions } from 'main/main-utils';

export class LauncherService {
  constructor(private scoringSvc: ScoringService) { }

  async launch(id: string, query: string) {
    const parsedId = searchIdHelper.parseId(id);
    const operator = dataOperatorsRegistry.find(x => x.name === parsedId.provider);
    if (!operator) {
      throw new Error(`Unknown provider ${parsedId.provider}`);
    }

    await operator.provider.launch(parsedId.value);
    this.scoringSvc.logLaunch(id, query);
    mainWindowInteractions.hide();
  }
}

export const launcerService = new LauncherService(scoringService);
