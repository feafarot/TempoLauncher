import React, { memo } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { QueryInput } from '../query-input';
import { ResultsList } from '../results-list';
import { uiConfig } from '../../../shared/ui-config';
import { Configurator } from '../configurator';
import { useApiAction } from 'renderer/api';
import { actions } from 'shared/contracts/actions';
import { ResultListItem } from '../result-list-item';
import { useSelectionControl, useWindowsSizeFix, useQuerying } from './search-frame-hooks';

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

export const SearchFrame: React.FC = memo(() => {
  const classes = useStyles();
  const { query, pluginKey, handleChange, result, resetData } = useQuerying();
  const selection = useSelectionControl(result.items);
  const requestLaunch = useApiAction(actions.launch, (resp) => {
    if (resp.success) {
      resetData();
      selection.reset();
    }
  });
  const requestMinimize = useApiAction(actions.minimize, () => { });
  useWindowsSizeFix(result.items.length);

  function launchSelected() {
    const targetId = result.items[selection.selectedIndex].id;
    requestLaunch({ targetId, query, source: pluginKey || undefined });
  }

  function onContainerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.keyCode) {
      case 38: // ArrowUp
        selection.handleUp();
        break;
      case 40: // ArrowDown
        selection.handleDown();
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
  }

  return <Configurator>
    <div className={classes.root} onKeyDown={onContainerKeyDown}>
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
            selected={i === selection.selectedIndex}
            icon={x.icon}
            matches={x.matches}
            value={x.display}
            helperText={x.value}
            onClick={launchSelected} />)} />
    </div>
  </Configurator>;
});
