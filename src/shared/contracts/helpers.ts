export class Action<TRequest, TResponse> {
  constructor(private name: string) { }
  static create<TRq = {}, TRp = {}>(name: string) {
    return new Action<TRq, TRp>(name);
  }
  get requestId() {
    return `REQ:${this.name}`;
  }
  get requestTypeRef() {
    return {} as TRequest;
  }
  get responseId() {
    return `RES:${this.name}`;
  }
  get responseTypeRef() {
    return {} as TResponse;
  }
}
