import { IpcMain } from 'electron';
import { actions } from 'shared/contracts/actions';
import { createListener } from './utils';
import { fileSearchService } from 'main/services/file-search-service';
import { DataItem } from 'shared/contracts/search';
import { mathService } from 'main/services/math-service';

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

    const files = await fileSearchService.search(rq.query);
    return {
      items: files.map<DataItem>(x => ({
        display: x.fileInfo.fileName,
        value: x.fileInfo.fullPath,
        icon: x.fileInfo.base64Icon,
        matches: x.matches
      }))
    };
  });
}
