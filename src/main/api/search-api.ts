import { IpcMain } from 'electron';
import { actions } from 'shared/contracts/actions';
import { createListener } from './utils';
import { DataItem } from 'shared/contracts/search';
import { mathService } from 'main/services/math-service';
import { searchService } from 'main/services/search-service';

export function initSearchApi(ipcMain: IpcMain) {
  createListener(ipcMain, actions.search, async rq => {
    let { queryObj, rebuildCache } = rq;
    let query = queryObj.query;
    if (!queryObj) {
      return {
        items: []
      };
    }

    if (!queryObj.pluginKey && query != '') {
      let skipMath = false;
      if (query.startsWith('\\')) {
        queryObj.query = query.substr(1);
        skipMath = true;
      }

      const mathResult = mathService.evalExpr(query);
      if (mathResult != null && mathResult != query && !skipMath) {
        return {
          items: [],
          mathEvalResult: mathResult
        };
      }
    }

    const files = await searchService.search(queryObj, { dataProviderOptions: { rebuildCache } });
    return {
      items: files.map<DataItem>(x => ({
        id: x.id,
        display: x.displayText,
        secondaryText: x.secondaryText,
        value: x.value,
        icon: x.icon,
        matches: x.matches,
        isPluginSelector: x.isPluginSelector
      }))
    };
  });

  createListener(ipcMain, actions.rebuildIndex, async rq => {
    await searchService.rebuildIndex();
  });
}
