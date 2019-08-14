export type Option<T> = T | null;

export function isArray(obj: any): obj is any[] {
  return obj instanceof Array;
}

export function fitContent() {
  const el = document.querySelector("body");
  if (el) {
    window.resizeTo(window.innerWidth, el.offsetHeight);
  }
}
