import { IpcMainEvent, IpcMain } from 'electron';
import { DataPacket, RequestDataPacket } from 'shared/contracts/abstract';
import { Action } from 'shared/contracts/helpers';

function createResponsePacket<T>(id: number, data: T): DataPacket<T> {
  return { id, data };
}

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
