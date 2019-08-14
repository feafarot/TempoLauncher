import { ipcRenderer, EventEmitter, IpcRenderer, IpcRendererEvent } from 'electron';
import { Action } from 'shared/contracts/helpers';
import { useEffect, useState } from 'react';
import { DataPacket } from 'shared/contracts/abstract';

const NullId = -1;
let previousActionId = 0;
function getNextId() {
  return ++previousActionId;
}

function createPacket<T>(data: T): DataPacket<T> {
  return {
    id: getNextId(),
    data
  };
}

export function useApiAction<TRq, TRp>(action: Action<TRq, TRp>, handler: (response: TRp) => void) {
  let currentId = NullId;
  useEffect(() => {
    function responseHandler(e: IpcRendererEvent, contractResponse: DataPacket<TRp>) {
      if (currentId === contractResponse.id) {
        handler(contractResponse.data);
        currentId = NullId;
      }
    }

    ipcRenderer.on(action.responseId, responseHandler);

    return () => {
      ipcRenderer.removeListener(action.responseId, responseHandler);
    };
  });

  return (request: TRq) => {
    const packet = createPacket(request);
    currentId = packet.id;
    ipcRenderer.send(action.requestId, packet);
  };
}
