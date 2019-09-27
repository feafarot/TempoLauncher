import { useState, useEffect, useCallback } from 'react';
import { DataItem } from 'shared/contracts/search';
import { useApiAction } from 'renderer/api';
import { actions } from 'shared/contracts/actions';
import { uiConfig } from 'shared/ui-config';
import { debounce } from 'lodash';
import { QueryInputActionInfo, QueryInputActionType } from '../query-input';

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

export function useWindowsSizeFix(resultsLength: number) {
  const requestResize = useApiAction(actions.resize, () => {});

  const resultsToRender = resultsLength > uiConfig.maxItemsShown ? uiConfig.maxItemsShown : resultsLength;
  const newHeight = resultsToRender * uiConfig.itemHeight + uiConfig.appIdleHeight;

  useEffect(
    () => {
      requestResize({ width: uiConfig.appWidth, height: newHeight });
    },
    [resultsLength]);
}

export function useQuerying() {
  type State = { items: DataItem[]; calc?: string };
  const defaultState: State = { items: [] };
  const [query, setQuery] = useState('');
  const [pluginKey, setPluginKey] = useState<string | null>(null);
  const [result, setResult] = useState<State>(defaultState);
  const runSearch = useApiAction(actions.search, resp => {
    setResult({ items: resp.items, calc: resp.mathEvalResult });
  });
  const debouncedRunSearch = useCallback(debounce(runSearch, 120), []);
  const handleChange = (actionInfo: QueryInputActionInfo) => {
    switch (actionInfo.type) {
      case QueryInputActionType.QueryChange:
        setQuery(actionInfo.query);
        debouncedRunSearch({ query: actionInfo.query, prefix: pluginKey || '' });
        break;
      case QueryInputActionType.SelectMode:
        setPluginKey(actionInfo.query);
        setQuery('');
        break;
    }
  };

  return {
    query,
    pluginKey,
    handleChange,
    result,
    resetData: () => {
      setPluginKey(null);
      setResult(defaultState);
      setQuery('');
    }
  };
}
