import React, { useState, memo, useEffect, useLayoutEffect, useCallback } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { QueryInput, QueryInputActionInfo, QueryInputActionType } from './query-input';
import { ResultsList } from './results-list';
import { uiConfig } from '../../shared/ui-config';
import { Configurator } from './configurator';
import { useApiAction } from 'renderer/api';
import { actions } from 'shared/contracts/actions';
import { DataItem } from 'shared/contracts/search';
import { ResultListItem } from './result-list-item';
import { debounce } from 'lodash';

const useStyles = makeStyles({
  root: {
    overflow: 'hidden'
  },
  mainFrame: {
    position: 'fixed',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    width: uiConfig.appWidth,
    minHeight: uiConfig.appIdleHeight,
    zIndex: 100,
    '-webkit-app-region': 'drag'
  },
  query: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    '-webkit-app-region': 'no-drag',
    marginLeft: 20
  },
  mathReslut: {
    position: 'absolute',
    fontSize: '11px',
    bottom: 6
  }
});

export function useQuerying() {
  type State = { items: DataItem[], calc?: string };
  const defaultState: State = { items: [] };
  const [query, setQuery] = useState('');
  const [pluginKey, setPluginKey] = useState<string | null>(null);
  const [result, setResult] = useState<State>(defaultState);
  const runSearch = useApiAction(actions.search, (resp) => {
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

  return [
    query,
    pluginKey,
    handleChange,
    result,
    () => {
      setPluginKey(null);
      setResult(defaultState);
      setQuery('');
    }
  ] as const;
}

function useSelectionControl(items: DataItem[]) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const maxIndex = items.length - 1;
  return [
    {
      handleUp: () => {
        if (items.length > 0) {
          setSelectedIndex(s => s === 0 ? maxIndex : s - 1);
        }
      },
      handleDown: () => {
        if (items.length > 0) {
          setSelectedIndex(s => s < maxIndex ? s + 1 : 0);
        }
      }
    },
    selectedIndex,
    () => setSelectedIndex(0)] as const;
}

function useWindowsSizeFix(resultsLength: number) {
  const requestResize = useApiAction(actions.resize, () => { });

  const resultsToRender = resultsLength > uiConfig.maxItemsShown ? uiConfig.maxItemsShown : resultsLength;
  const newHeight = resultsToRender * uiConfig.itemHeight + uiConfig.appIdleHeight;

  useEffect(
    () => {
      requestResize({ width: uiConfig.appWidth, height: newHeight });
    },
    [resultsLength]);
}

export const Root: React.FC = memo(() => {
  const classes = useStyles();
  const [query, pluginKey, handleChange, result, resetData] = useQuerying();
  const [handlers, selectedIndex, resetSelected] = useSelectionControl(result.items);
  const requestLaunch = useApiAction(actions.launch, (resp) => {
    if (resp.success) {
      resetData();
      resetSelected();
    }
  });
  const requestMinimize = useApiAction(actions.minimize, () => { });
  useWindowsSizeFix(result.items.length);

  function launchSelected() {
    const targetId = result.items[selectedIndex].id;
    requestLaunch({ targetId, query, source: pluginKey || undefined });
  }

  return <Configurator>
    <div className={classes.root} onKeyDown={e => {
      switch (e.keyCode) {
        case 38: // ArrowUp
          handlers.handleUp();
          break;
        case 40: // ArrowDown
          handlers.handleDown();
          break;
        case 13: // Enter
          launchSelected();
          resetData();
          break;
        case 116: // F5
          break;
        case 27: // Esc
          requestMinimize();
          resetData();
          break;
      }
    }}>
      <Paper className={classes.mainFrame}>
        <div className={classes.query}>
          <QueryInput query={query} onChange={handleChange} />
          {result.calc
            && <span className={classes.mathReslut}> = {result.calc}</span>}
        </div>
      </Paper>
      <ResultsList
        children={result.items.map((x, i) =>
          <ResultListItem
            key={x.value}
            selected={i === selectedIndex}
            icon={x.icon}
            matches={x.matches}
            value={x.display}
            helperText={x.value}
            onClick={launchSelected} />)} />
    </div>
  </Configurator>;
});
