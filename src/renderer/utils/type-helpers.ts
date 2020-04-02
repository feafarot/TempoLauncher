type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

type DeepReadonlyObject<T> = {
  readonly [key in keyof T]: DeepReadonly<T[key]>;
};

export type DeepReadonly<T> =
  T extends Array<infer ArrT> ? DeepReadonlyArray<ArrT> :
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T;

export type DR<T> = DeepReadonly<T>;
