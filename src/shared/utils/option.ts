type Some<T> = T;

const None = Symbol('none');
type None = typeof None;

type Null =
  | undefined
  | null
  | void;

export class Option<T> {
  constructor(private value: T | None | Null) {
  }

  static of<T>(value: T) {
    return new Option(value);
  }

  static isNull<T>(value: T | None | Null): value is (Null | None) {
    return value === null || value === undefined || value === None;
  }

  static isSome<T>(value: T | None | Null): value is T {
    return value != null && value !== None;
  }

  static bind<TIn, TOut>(opt: Option<TIn>, fn: (x: TIn) => Option<TOut>) {
    if (Option.isSome(opt.value)) {
      return fn(opt.value);
    }

    return Option.none<TOut>();
  }

  static match<TIn, TOut>(opt: Option<TIn>, onSome: (val: TIn) => TOut, onNone: () => TOut) {
    if (Option.isSome(opt.value)) {
      return onSome(opt.value);
    }

    return onNone();
  }

  static map<TIn, TOut>(opt: Option<TIn>, fn: (x: TIn) => TOut): Option<TOut> {
    return Option.bind(opt, x => Option.of(fn(x)));
  }

  static none<T>() {
    return new Option<T>(None);
  }

  static some<T>(value: T) {
    return new Option<T>(value);
  }

  get isSome() {
    return !Option.isNull(this.value);
  }

  get isNone() {
    return Option.isNull(this.value);
  }

  map<TOut>(fn: (x: T) => TOut) {
    return Option.map<T, TOut>(this, fn);
  }

  match<TOut>(onSome: (val: T) => TOut, onNone: () => TOut) {
    return Option.match<T, TOut>(this, onSome, onNone);
  }

  getValueOrNull() {
    return this.getValueOrDefault(null);
  }

  getValueOrDefault<TDef>(defaultValue: TDef) {
    if (Option.isSome(this.value)) {
      return this.value;
    }

    return defaultValue;
  }
}
