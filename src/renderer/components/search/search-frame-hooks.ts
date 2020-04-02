import { useState, useEffect, useCallback } from 'react';
import { DataItem, SearchRequest } from 'shared/contracts/search';
import { useApiAction } from 'renderer/api';
import { actions } from 'shared/contracts/actions';
import { uiConfig } from 'shared/ui-config';
import { debounce } from 'lodash';
import { QueryInputActionInfo, QueryInputActionType } from './query-input';

export function useSelectionControl(items: DataItem[]) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const maxIndex = items.length - 1;
  return {
    selectedIndex,
    handleUp: useCallback(
      () => {
        if (items.length > 0) {
          setSelectedIndex(s => (s === 0 ? maxIndex : s - 1));
        }
      },
      [items, maxIndex]),
    handleDown: useCallback(
      () => {
        if (items.length > 0) {
          setSelectedIndex(s => (s < maxIndex ? s + 1 : 0));
        }
      },
      [items, maxIndex]),
    reset: useCallback(() => setSelectedIndex(0), [])
  };
}

export function useWindowsSizeFix(resultsLength: number) {
  const requestResize = useApiAction(actions.resize, () => { });

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
  const [activePlugin, setActivePluginState] = useState<DataItem | null>(null);
  const [result, setResult] = useState<State>(defaultState);
  const runApiSearch = useApiAction(actions.search, resp => {
    setResult({ items: resp.items, calc: resp.mathEvalResult });
  });
  const runSearch = useCallback(
    (request: SearchRequest) => {
      setResult({ items: [], calc: result.calc });
      runApiSearch(request);
    },
    []);

  const getPluginKey = useCallback(() => (activePlugin ? activePlugin.value : undefined), [activePlugin]);
  const setActivePlugin = useCallback(
    (plugin: DataItem | null) => {
      if (plugin) {
        setActivePluginState(plugin);
        setQuery('');
        debouncedRunSearch({ queryObj: { query: '', pluginKey: plugin.value } });
      }
      else if (activePlugin) {
        setQuery(activePlugin.display);
        setActivePluginState(null);
        debouncedRunSearch({ queryObj: { query: activePlugin.display } });
      }
    },
    [activePlugin]);

  const debouncedRunSearch = useCallback(debounce(runSearch, 120), []);
  const handleChange = useCallback(
    (actionInfo: QueryInputActionInfo) => {
      switch (actionInfo.type) {
        case QueryInputActionType.QueryChange:
          setQuery(actionInfo.query);
          debouncedRunSearch({ queryObj: { query: actionInfo.query, pluginKey: getPluginKey() } });
          break;
        case QueryInputActionType.ClearPlugin:
          if (activePlugin) {
            setActivePlugin(null);
          }

          break;
      }
    },
    [activePlugin]);

  const resetData = useCallback(
    (persistCalcResult: boolean = false) => {
      setActivePlugin(null);
      if (!persistCalcResult) {
        setResult(defaultState);
        setQuery('');
      }
    },
    []);

  return {
    query,
    activePluginInfo: activePlugin,
    handleChange,
    result,
    setActivePlugin,
    resetData
  };
}
