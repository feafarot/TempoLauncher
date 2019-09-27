import { useSelectionControl } from './search-frame-hooks';
import { renderHook, act } from '@testing-library/react-hooks';
import { DataItem } from 'shared/contracts/search';

describe('useSelectionControl hook', () => {
  it('Should not fail with empty items array passed.', () => {
    renderHook(() => useSelectionControl([]));
  });

  it('Index should always be 0 with 1 item.', () => {
    const { result } = renderHook(() => useSelectionControl(new Array<DataItem>(1)));
    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.handleUp();
    });
    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.handleDown();
    });
    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.reset();
    });
    expect(result.current.selectedIndex).toBe(0);
  });

  it('Should work with multiple item passed.', () => {
    const { result } = renderHook(() => useSelectionControl(new Array<DataItem>(3)));
    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.handleUp();
    });
    expect(result.current.selectedIndex).toBe(2);

    act(() => {
      result.current.handleDown();
    });
    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.handleDown();
    });
    expect(result.current.selectedIndex).toBe(1);

    act(() => {
      result.current.reset();
    });
    expect(result.current.selectedIndex).toBe(0);
  });
});
