import { IpcMain } from 'electron';
import { actions } from 'shared/contracts/actions';
import { createListener } from './utils';
import { DataItem } from 'shared/contracts/search';
import { mathService } from 'main/services/math-service';
import { searchService } from 'main/services/search-service';

export function initSearchApi(ipcMain: IpcMain) {
  createListener(ipcMain, actions.search, async rq => {
    let query = rq.query;
    if (!query) {
      return {
        items: []
      };
    }

    let skipMath = false;
    if (query.startsWith('\\')) {
      query = query.substr(1);
      skipMath = true;
    }

    const mathResult = mathService.evalExpr(query);
    if (mathResult != null && mathResult != query && !skipMath) {
      return {
        items: [],
        mathEvalResult: mathResult
      };
    }

    const files = await searchService.search(query, { dataProviderOptions: { rebuildCache: rq.rebuildCache } });
    return {
      items: files.map<DataItem>(x => ({
        id: x.id,
        display: x.displayText,
        secondaryText: x.secondaryText,
        value: x.value,
        icon: x.icon,
        matches: x.matches
      }))
    };
  });
}
