// import * as React from 'react';
// import { configure, mount } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

// export { act } from 'react-dom/test-utils';

// const TestHook: React.FC<{ callback: () => void }> = ({ callback }) => {
//   callback();
//   return null;
// };

// export function mountHook(callback: () => void) {
//   mount(<TestHook callback={callback} />);
// }

// // tslint:disable-next-line: no-any
// export function testHook(name: string, callback: () => void) {
//   test(name, async () => {
//     mountHook(callback);
//   });
// }

// export function initEnzyme() {
//   configure({ adapter: new Adapter() });
// }

// initEnzyme();

export function asMock<T>(obj: T) {
  // tslint:disable-next-line: no-any
  return (obj as any) as jest.Mock<T>;
}

export function getLastCallArgs<T>(obj: T) {
  const mockObj = asMock(obj);
  return mockObj.mock.calls[mockObj.mock.calls.length - 1];
}

export function createPuppetPromise() {
  let resolve: (() => void) | null = null;
  let rejesct: (() => void) | null = null;
  const promise = new Promise((rs, rj) => {
    resolve = rs;
    rejesct = rj;
  });
  return [promise, resolve!, rejesct!] as const;
}
