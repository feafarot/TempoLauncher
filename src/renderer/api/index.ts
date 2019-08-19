import { ipcRenderer, IpcRendererEvent } from 'electron';
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
  let [currentId, setCurrentId] = useState(NullId);
  useEffect(
    () => {
      function responseHandler(e: IpcRendererEvent, contractResponse: DataPacket<TRp>) {
        if (currentId === contractResponse.id) {
          handler(contractResponse.data);
          setCurrentId(NullId);
        }
      }

      ipcRenderer.on(action.responseId, responseHandler);

      return () => {
        ipcRenderer.removeListener(action.responseId, responseHandler);
      };
    },
    [currentId]);

  return (request: TRq) => {
    const packet = createPacket(request);
    setCurrentId(packet.id);
    ipcRenderer.send(action.requestId, packet);
  };
}
