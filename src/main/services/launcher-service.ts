import { searchIdHelper } from './search-id-helper';
import { dataOperatorsRegistry } from 'main/data-operators/providers-registry';
import { ScoringService, scoringService } from './scoring-service';
import { mainWindowInteractions } from 'main/main-utils';
import { SearchQuery } from 'shared/contracts/search';

export class LauncherService {
  constructor(private scoringSvc: ScoringService) { }

  async launch(id: string, queryObj: SearchQuery) {
    const parsedId = searchIdHelper.parseId(id);
    const operator = dataOperatorsRegistry.find(x => x.name === parsedId.provider);
    if (!operator) {
      throw new Error(`Unknown provider ${parsedId.provider}`);
    }

    const result = await operator.operator.launch(parsedId.value, queryObj.query);
    this.scoringSvc.logLaunch(id, queryObj.query);
    if (result) {
      mainWindowInteractions.hide();
    }
  }
}

export const launcherService = new LauncherService(scoringService);
