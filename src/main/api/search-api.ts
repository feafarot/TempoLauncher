import { IpcMain } from 'electron';
import { actions } from 'shared/contracts/actions';
import { createListener } from './utils';
import { DataItem } from 'shared/contracts/search';
import { mathService } from 'main/services/math-service';
import { searchService } from 'main/services/search-service';

export function initSearchApi(ipcMain: IpcMain) {
  createListener(ipcMain, actions.search, async rq => {
    if (!rq.query) {
      return {
        items: []
      };
    }

    const mathResult = mathService.evalExpr(rq.query);
    if (mathResult != null && mathResult != rq.query && !rq.query.startsWith('\\')) {
      return {
        items: [],
        mathEvalResult: mathResult
      };
    }

    const files = await searchService.search(rq.query);
    return {
      items: files.map<DataItem>(x => ({
        id: x.id,
        display: x.displayText,
        value: x.value,
        icon: x.icon,
        matches: x.matches
      }))
    };
  });
}
