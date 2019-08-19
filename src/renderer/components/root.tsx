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

const useStyles = makeStyles({
  root: { },
  mainFrame: {
    width: windowConfig.width,
    minHeight: windowConfig.height,
    '-webkit-app-region': 'drag'
  },
  query: {
    '-webkit-app-region': 'no-drag'
  }
});

export function useQuerying() {
  const [query, setQuery] = useState('');
  const [pluginKey, setPluginKey] = useState<Option<string>>(null);
  const [result, setResult] = useState<DataItem[]>([]);
  const runSearch = useApiAction(actions.search, (resp) => {
    setResult(resp.items);
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
        </div>
      </Paper>
      <ResultsList children={result.map(x =>
        <div key={x.value}>
          <img src={`data:image/png;base64,${x.icon}`} />
          <span>{x.display}</span>
        </div>)} />
    </div>
  </Configurator>;
};
