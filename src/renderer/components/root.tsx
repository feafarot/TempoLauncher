import React, { useState } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { QueryInput, QueryInputActionInfo, QueryInputActionType } from './query-input';
import { Option } from 'shared/utils';
import { ResultsList } from './results-list';
import { windowConfig } from '../config';
import { Configurator } from './configurator';
import { useApiAction } from 'renderer/api';
import { actions } from 'shared/contracts/actions';
import { SearchResponse, DataItem } from 'shared/contracts/search';
import { ResultListItem } from './result-list-item';

const useStyles = makeStyles({
  root: { },
  mainFrame: {
    width: windowConfig.width,
    minHeight: windowConfig.height,
    '-webkit-app-region': 'drag'
  },
  query: {
    display: 'inline-block',
    '-webkit-app-region': 'no-drag'
  }
});

export function useQuerying() {
  const [query, setQuery] = useState('');
  const [pluginKey, setPluginKey] = useState<Option<string>>(null);
  const [result, setResult] = useState<{ items: DataItem[], calc?: string }>({ items: [] });
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
      case QueryInputActionType.Submit:
        setPluginKey(null);
        setQuery('');
        // Perform Action
        break;
    }
  };

  //const result = Array.from(new Array(query.length)).map((x, i) => `Result ##${i}`);

  return [query, pluginKey, handleChange, result] as const;
}

export const Root: React.FC = () => {
  const classes = useStyles();
  const [query, pluginKey, handleChange, result] = useQuerying();
  return <Configurator>
    <div className={classes.root}>
      <Paper className={classes.mainFrame}>
        <div className={classes.query}>
          <QueryInput query={query} onChange={handleChange} />
          <span>{result.calc}</span>
        </div>
      </Paper>
      <ResultsList children={result.items.map(x =>
        <ResultListItem key={x.value} icon={x.icon} matches={x.matches} value={x.display} />)} />
    </div>
  </Configurator>;
};
