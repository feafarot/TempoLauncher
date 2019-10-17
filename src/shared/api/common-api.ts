import { DataPacket, RequestDataPacket } from 'shared/contracts/abstract';
import { Action } from 'shared/contracts/helpers';

export const NullId = -1;

function createIdFactory() {
  let previousActionId = 0;
  return () => ++previousActionId;
}

export const getNextId = createIdFactory();

export function createResponsePacket<T>(id: number, data: T): DataPacket<T> {
  return { id, data };
}

export function createRequestPacket<TRq, TRp>(action: Action<TRq, TRp>, data: TRq): RequestDataPacket<TRq> {
  const packetId = getNextId();
  return {
    id: packetId,
    reponseId: action.getResponseId(packetId.toString()),
    data
  };
}
