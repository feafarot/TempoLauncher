import { ipcRenderer, IpcRendererEvent } from 'electron';
import { Action } from 'shared/contracts/helpers';
import { useEffect, useState, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { DataPacket, RequestDataPacket } from 'shared/contracts/abstract';
import { NullId, createRequestPacket as createRequestPacket, createResponsePacket } from 'shared/api/common-api';

// function execAction<TRq, TRp>(action: Action<TRq, TRp>, request: TRq) {
//   let currentId = NullId;
//   const promise = new Promise<TRp>((resolve) => {
//     function responseHandler(e: IpcRendererEvent, contractResponse: DataPacket<TRp>) {
//       if (contractResponse && currentId === contractResponse.id) {
//         currentId = NullId;
//         resolve(contractResponse.data);
//         ipcRenderer.removeListener(action.responseId, responseHandler);
//       }
//     }

//     ipcRenderer.on(action.responseId, responseHandler);

//     const packet = createPacket(request);
//     currentId = packet.id;
//     ipcRenderer.send(action.requestId, packet);
//   });

//   return promise;
// }

export function useApiAction<TRq, TRp>(action: Action<TRq, TRp>, handler: (response: TRp) => void) {
  const cref = useRef({ currentId: NullId });
  const responseHandler = (e: IpcRendererEvent, contractResponse: DataPacket<TRp>) => {
    if (cref.current.currentId === contractResponse.id) {
      handler(contractResponse.data);
      cref.current.currentId = NullId;
    }
  };

  return (request: TRq) => {
    const packet = createRequestPacket(action, request);
    cref.current.currentId = packet.id;
    ipcRenderer.once(packet.reponseId, responseHandler);
    ipcRenderer.send(action.requestId, packet);
  };
}

export function useApiListener<TRq, TRp>(action: Action<TRq, TRp>, listener: (request: TRq) => Promise<TRp>) {
  useEffect(() => {
    async function requestHandler(e: IpcRendererEvent, args: RequestDataPacket<TRq>) {
      const res = await listener(args.data);
      e.sender.send(args.reponseId, createResponsePacket(args.id, res));
    }

    ipcRenderer.on(action.requestId, requestHandler);
    return () => {
      ipcRenderer.removeListener(action.requestId, requestHandler);
    };
  });
}
