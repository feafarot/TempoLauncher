import { ipcMain, app } from 'electron';
import { actions } from 'shared/contracts/actions';
import { createListener } from './utils';
import { search } from 'main/services/search-service';

export function initializeApi() {
  createListener(ipcMain, actions.search, async rq => {
    const files = await search();
    if (!rq.query) {
      return {
        items: []
      };
    }

    return {
      items: files.map(x => ({ display: x.name, value: x.file, icon: x.icon }))
    };// ['#1 test', '#2 test qwer', `#3 Request: ${rq}`];
  });
}
