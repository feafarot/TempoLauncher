// tslint:disable-next-line: no-any
export function isArray(obj: any): obj is any[] {
  return obj instanceof Array;
}

export function fitContent() {
  const el = document.querySelector('body');
  if (el) {
    window.resizeTo(window.innerWidth, el.offsetHeight);
  }
}

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function createControlledPromise<T>() {
  let resolve: ((value: T) => void) | null = null;
  // tslint:disable-next-line: no-any
  let rejesct: ((reason: any) => void) | null = null;
  const promise = new Promise<T>((rs, rj) => {
    resolve = rs;
    rejesct = rj;
  });
  return [promise, resolve!, rejesct!] as const;
}
