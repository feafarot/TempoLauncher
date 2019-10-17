import { IpcMainEvent, IpcMain, BrowserWindow } from 'electron';
import { DataPacket, RequestDataPacket } from 'shared/contracts/abstract';
import { Action } from 'shared/contracts/helpers';
import { createResponsePacket, createRequestPacket } from 'shared/api/common-api';
import { createControlledPromise } from 'shared/utils';
import { WindowsName, windows } from 'main/windows';

export type Handler<TRequest, TResponse> = (request: TRequest, e: IpcMainEvent) => void | Promise<TResponse>;

export function createListener<TRequest, TResponse>(ipc: IpcMain, action: Action<TRequest, TResponse>, handler: Handler<TRequest, TResponse>) {
  ipc.on(action.requestId, (e, arg: RequestDataPacket<typeof action.requestTypeRef>) => {
    const maybePromise = handler(arg.data, e);
    if (maybePromise instanceof Promise) {
      maybePromise.then(x => e.reply(arg.reponseId, createResponsePacket(arg.id, x)));
    }
    else {
      throw new Error('Sync replies are not supproted.');
    }
  });
}

export function sendRequest<TRequest, TResponse>(
  ipc: IpcMain,
  target: BrowserWindow,
  action: Action<TRequest, TResponse>,
  data: TRequest) {
  const request = createRequestPacket(action, data);
  const [promise, resolve,] = createControlledPromise<TResponse>();
  ipc.once(request.reponseId, (e: IpcMainEvent, response: DataPacket<TResponse>) => {
    resolve(response.data);
  });
  target.webContents.send(action.requestId, request);
  return promise;
}

export function createRequestSender<TRequest, TResponse>(ipc: IpcMain, targetName: WindowsName, action: Action<TRequest, TResponse>) {
  return (data: TRequest) => {
    return sendRequest(ipc, windows[targetName]!, action, data);
  };
}
