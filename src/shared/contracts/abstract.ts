export interface DataPacket<T> {
  id: number;
  data: T;
}

export interface RequestDataPacket<T> extends DataPacket<T> {
  reponseId: string;
}
