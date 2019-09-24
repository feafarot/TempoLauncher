import { useState } from 'react';
import { DataItem } from 'shared/contracts/search';

export function useSelectionControl(items: DataItem[]) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const maxIndex = items.length - 1;
  return {
    handleUp: () => {
      if (items.length > 0) {
        setSelectedIndex(s => (s === 0 ? maxIndex : s - 1));
      }
    },
    handleDown: () => {
      if (items.length > 0) {
        setSelectedIndex(s => (s < maxIndex ? s + 1 : 0));
      }
    },
    selectedIndex,
    reset: () => setSelectedIndex(0)
  };
}
