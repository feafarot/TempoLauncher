import { renderHook, act } from '@testing-library/react-hooks';
import { Action } from 'shared/contracts/helpers';
import { ipcRenderer } from 'electron';
import { asMock, getLastCallArgs, createPuppetPromise } from 'renderer/utils/test-utils';
import { useApiAction } from '.';
import { RequestDataPacket } from 'shared/contracts/abstract';

jest.mock(
  'electron',
  () => ({
    ipcRenderer: ((): Partial<typeof ipcRenderer> => {
      const map = new Map<string, Function[]>();
      return {
        // tslint:disable: no-any
        on: jest.fn().mockImplementation((event: string, fn: Function) => {
          map.set(event, [...(map.get(event) || []), fn]);
        }),
        once: jest.fn().mockImplementation((event: string, fn: Function) => {
          map.set(event, [...(map.get(event) || []), (...args: any[]) => {
            map.set(event, (map.get(event) || []).filter(x => x !== fn));
            fn(...args);
          }]);
        }),
        send: jest.fn().mockImplementation((event: string, data: RequestDataPacket<any>) => {
          (map.get(data.reponseId) || []).forEach(fn => {
            //fn({}, data);
            setTimeout(() => fn({}, data), 50);
          });
        }),
        removeListener: jest.fn().mockImplementation((event: string, listener: Function) => {
          map.set(event, (map.get(event) || []).filter(x => x !== listener));
        })
        // tslint:enable: no-any
      };
    })()
  }),
  { virtual: true }
);

const testAction = new Action<{ value: string }, { value: string }>('test');

describe('useApiAction hook', () => {
  const callbackMock = jest.fn();

  beforeEach(() => {
    callbackMock.mockClear();
    asMock(ipcRenderer.send).mockClear();
    asMock(ipcRenderer.on).mockClear();
    asMock(ipcRenderer.once).mockClear();
    asMock(ipcRenderer.removeListener).mockClear();
  });

  it('Should render', () => {
    renderHook(() => useApiAction(testAction, callbackMock));
  });

  // it('Should add and remove event listeners', () => {
  //   const { unmount } = renderHook(() => useApiAction(testAction, callbackMock));

  //   //expect(getLastCallArgs(ipcRenderer.on)[0]).toBe(testAction.responseId);

  //   unmount();
  //   //expect(getLastCallArgs(ipcRenderer.removeListener)[0]).toBe(testAction.responseId);
  // });

  it('Should send request and recieve result', async () => {
    const [callbackPromise, resolveCallback] = createPuppetPromise();
    callbackMock.mockImplementationOnce(() => resolveCallback());

    const { result } = renderHook(() => useApiAction(testAction, callbackMock));
    act(() => {
      result.current({ value: 't1' });
    });

    expect(ipcRenderer.send).toBeCalledTimes(1);
    expect(ipcRenderer.once).toBeCalledTimes(1);
    const [arg1, arg2] = getLastCallArgs(ipcRenderer.send);
    expect(arg1).toBe(testAction.requestId);
    expect(arg2.data).toEqual({ value: 't1' });

    await callbackPromise;

    expect(callbackMock).toBeCalledTimes(1);
    const [cbArg1] = getLastCallArgs(callbackMock);
    expect(cbArg1).toEqual({ value: 't1' });
  });
});
