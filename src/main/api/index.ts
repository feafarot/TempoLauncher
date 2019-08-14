import { IpcMain, Event, ipcMain, IpcMainEvent } from 'electron';
import { DataPacket } from 'shared/contracts/abstract';
import { actions } from 'shared/contracts/actions';
import { Action } from 'shared/contracts/helpers';

type Handler<TRequest, TResponse> = (request: TRequest, e: IpcMainEvent) => void | Promise<TResponse>;

function createResponsePacket<T>(id: number, data: T): DataPacket<T> {
  return { id, data };
}

export function createListener<TRequest, TResponse>(
  ipc: IpcMain,
  action: Action<TRequest, TResponse>,
  handler: Handler<TRequest, TResponse>) {
  ipc.on(action.requestId, (e, arg: DataPacket<typeof action.requestTypeRef>) => {
    const maybePromise = handler(arg.data, e);
    if (maybePromise instanceof Promise) {
      maybePromise.then(x => e.reply(action.responseId, createResponsePacket(arg.id, x)));
    }
  });
}

export function initializeApi() {
  createListener(ipcMain, actions.search, async rq => {
    if (!rq.query) {
      return {
        items: []
      };
    }

    return {
      items: [
        { display: '#1 test', value: '#1 test' },
        { display: '#2 test qwer', value: '#2 test qwer' },
        { display: `#3 Request: ${rq.query}`, value: `#3 Request: ${rq.query}` }]
    };// ['#1 test', '#2 test qwer', `#3 Request: ${rq}`];
  });
}
