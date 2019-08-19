export type Option<T> = T | null;

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
