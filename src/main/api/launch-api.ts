import { createListener } from './utils';
import { actions } from 'shared/contracts/actions';
import { IpcMain } from 'electron';
import { launcerService } from 'main/services/launcher-service';

export function initLaunchApi(ipcMain: IpcMain) {
  createListener(ipcMain, actions.launch, async rq => {
    if (!rq.targetId || rq.targetId.length < 0) {
      return { success: false, error: 'Launch target is empty.' };
    }

    try {
      launcerService.launch(rq.targetId);
    }
    catch (e) {
      return { success: false, error: e };
    }

    return {
      success: true
    };
  });
}
