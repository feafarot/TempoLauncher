import 'shared/ui-config';
import { useApiAction } from 'renderer/api';
import { asMock } from 'renderer/utils/test-utils';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWindowsSizeFix } from './search-frame-hooks';

const mockApiRequest = jest.fn();
jest.mock('shared/ui-config', () => ({
  uiConfig: { appIdleHeight: 10, appWidth: 20, itemHeight: 1, maxItemsShown: 3 }
}));
jest.mock('renderer/api');

describe('useWindowsSizeFix hook', () => {
  asMock(useApiAction).mockReturnValue(mockApiRequest);

  beforeEach(() => {
    asMock(useApiAction).mockClear();
    mockApiRequest.mockClear();
  });

  it('Should render', () => {
    renderHook(() => useWindowsSizeFix(0));
  });

  it('Should requset resize with correct values, correct amount of times', () => {
    const { rerender } = renderHook<{ itemsCount: number }, void>(({ itemsCount }) => useWindowsSizeFix(itemsCount), { initialProps: { itemsCount: 5 } });
    expect(asMock(useApiAction).mock.calls.length).toBe(1);
    act(() => {});
    expect(mockApiRequest).toBeCalledTimes(1);
    expect(mockApiRequest.mock.calls[0][0].height).toBe(10 + 3);

    act(() => rerender({ itemsCount: 2 }));
    act(() => rerender({ itemsCount: 2 })); // Make sure that request is fired only when prop changed.
    expect(mockApiRequest).toBeCalledTimes(2);
    expect(mockApiRequest.mock.calls[1][0].height).toBe(10 + 2);
  });
});
