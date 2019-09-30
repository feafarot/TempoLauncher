import { ipcRenderer, IpcRendererEvent } from 'electron';
import { Action } from 'shared/contracts/helpers';
import { useEffect, useState, useMemo, useLayoutEffect, useCallback, useRef } from 'react';
import { DataPacket, RequestDataPacket } from 'shared/contracts/abstract';

const NullId = -1;
let previousActionId = 0;
function getNextId() {
  return ++previousActionId;
}

function createPacket<TRq, TRp>(action: Action<TRq, TRp>, data: TRq): RequestDataPacket<TRq> {
  const packetId = getNextId();
  return {
    id: packetId,
    reponseId: action.getResponseId(packetId.toString()),
    data
  };
}

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

// export function useApiAction<TRq, TRp>(action: Action<TRq, TRp>, handler: (response: TRp) => void) {
//   //let [currentId, setCurrentId] = useState(NullId);
//   // useEffect(
//   //   () => {
//   //     function responseHandler(e: IpcRendererEvent, contractResponse: DataPacket<TRp>) {
//   //       if (currentId === contractResponse.id) {
//   //         handler(contractResponse.data);
//   //         setCurrentId(NullId);
//   //       }
//   //     }

//   //     ipcRenderer.on(action.responseId, responseHandler);

//   //     return () => {
//   //       ipcRenderer.removeListener(action.responseId, responseHandler);
//   //     };
//   //   },
//   //   [action, currentId]);

//   return (request: TRq) => {
//     let currentId = NullId;
//     function responseHandler(e: IpcRendererEvent, contractResponse: DataPacket<TRp>) {
//       if (currentId === contractResponse.id) {
//         handler(contractResponse.data);
//         currentId = NullId;
//       }

//       ipcRenderer.removeListener(action.responseId, responseHandler);
//     }

//     ipcRenderer.on(action.responseId, responseHandler);

//     const packet = createPacket(request);
//     currentId = packet.id;
//     ipcRenderer.send(action.requestId, packet);
//   };
// }

// export function useApiAction2<TRq, TRp>(action: Action<TRq, TRp>, handler: (response: TRp) => void) {
//   let [currentId, setCurrentId] = useState(NullId);
//   useLayoutEffect(
//     () => {
//       function responseHandler(e: IpcRendererEvent, contractResponse: DataPacket<TRp>) {
//         if (currentId === contractResponse.id) {
//           handler(contractResponse.data);
//           setCurrentId(NullId);
//         }
//       }

//       ipcRenderer.on(action.responseId, responseHandler);

//       return () => {
//         ipcRenderer.removeListener(action.responseId, responseHandler);
//       };
//     },
//     [currentId]);

//   return (request: TRq) => {
//     const packet = createPacket(request);
//     setCurrentId(packet.id);
//     ipcRenderer.send(action.requestId, packet);
//   };
// }

export function useApiAction<TRq, TRp>(action: Action<TRq, TRp>, handler: (response: TRp) => void) {
  //const [currentId, setCurrentId] = useState(NullId);
  const cref = useRef({ currentId: NullId });
  const responseHandler = (e: IpcRendererEvent, contractResponse: DataPacket<TRp>) => {
    if (cref.current.currentId === contractResponse.id) {
      //console.log(`-> currentId: ${currentId}`);
      handler(contractResponse.data);
      cref.current.currentId = NullId;
      //setCurrentId(NullId);
    }
  };
    // , [currentId]);
  return (request: TRq) => {
    const packet = createPacket(action, request);
    cref.current.currentId = packet.id;
    //setCurrentId(packet.id);
    ipcRenderer.once(packet.reponseId, responseHandler);
    ipcRenderer.send(action.requestId, packet);
  };
}
