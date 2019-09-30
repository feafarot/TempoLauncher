const requestPrefix = 'REQ:';
const responsePrefix = 'RES:';

export class Action<TRequest, TResponse> {
  constructor(private name: string) { }

  static create<TRq = {}, TRp = {}>(name: string) {
    return new Action<TRq, TRp>(name);
  }

  static getResponseId(requestId: string) {
    return requestId.replace(requestPrefix, responsePrefix);
  }

  get requestId() {
    return `${requestPrefix}${this.name}`;
  }

  get requestTypeRef() {
    return {} as TRequest;
  }

  getResponseId(actionId: string) {
    return `${responsePrefix}${this.name}__${actionId}`;
  }

  get responseTypeRef() {
    return {} as TResponse;
  }
}
