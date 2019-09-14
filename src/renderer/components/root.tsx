import React, { useState, memo } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { QueryInput, QueryInputActionInfo, QueryInputActionType } from './query-input';
import { Option } from 'shared/utils';
import { ResultsList } from './results-list';
import { windowConfig } from '../config';
import { Configurator } from './configurator';
import { useApiAction } from 'renderer/api';
import { actions } from 'shared/contracts/actions';
import { DataItem } from 'shared/contracts/search';
import { ResultListItem } from './result-list-item';

const useStyles = makeStyles({
  root: {
    overflow: 'hidden'
  },
  mainFrame: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: windowConfig.width,
    minHeight: windowConfig.height,
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
  const defaultState = { items: [] };
  const [query, setQuery] = useState('');
  const [pluginKey, setPluginKey] = useState<Option<string>>(null);
  const [result, setResult] = useState<{ items: DataItem[], calc?: string }>(defaultState);
  const runSearch = useApiAction(actions.search, (resp) => {
    setResult({ items: resp.items, calc: resp.mathEvalResult });
  });

  const handleChange = (actionInfo: QueryInputActionInfo) => {
    switch (actionInfo.type) {
      case QueryInputActionType.QueryChange:
        setQuery(actionInfo.query);
        runSearch({ query: actionInfo.query, prefix: pluginKey || '' });
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
  const [selected, setSelected] = useState(0);
  return [
    {
      handleUp: () => {
        if (items.length > 0 && selected > 0) {
          setSelected(s => s - 1);
        }
      },
      handleDown: () => {
        if (items.length > 0 && selected < items.length - 1) {
          setSelected(s => s + 1);
        }
      }
    },
    selected] as const;
}

export const Root: React.FC = memo(() => {
  const classes = useStyles();
  const [query, pluginKey, handleChange, result, resetData] = useQuerying();
  const [handlers, selectedIndex] = useSelectionControl(result.items);
  const requestLaunch = useApiAction(actions.launch, (resp) => {
    if (resp.success) {
      resetData();
    }
  });
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
          const targetId = result.items[selectedIndex].id;
          requestLaunch({ targetId });
          // Perform submit
          break;
        case 116: // F5

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
        selectedIndex={selectedIndex}
        children={result.items.map(x =>
          <ResultListItem key={x.value} icon={x.icon} matches={x.matches} value={x.display} helperText={x.value} />)} />
    </div>
  </Configurator>;
});
