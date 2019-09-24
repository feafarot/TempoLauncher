import { useSelectionControl } from './search-frame-hooks';
import { renderHook, act } from '@testing-library/react-hooks';
import { DataItem } from 'shared/contracts/search';

test('Should not fail with empty', () => {
  renderHook(() => useSelectionControl([]));
});

test('Should work with one item', () => {
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

test('Should work with multiple item', () => {
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
