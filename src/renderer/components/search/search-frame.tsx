import React, { memo } from 'react';
import { makeStyles, Paper, Collapse, IconButton, createStyles } from '@material-ui/core';
import { QueryInput } from './query-input';
import { ResultsList } from '../results-list';
import { uiConfig } from '../../../shared/ui-config';
import { Configurator } from '../configurator';
import { useApiAction, useApiListener } from 'renderer/api';
import { actions } from 'shared/contracts/actions';
import { ResultListItem } from '../result-list-item';
import { useSelectionControl, useWindowsSizeFix, useQuerying } from './search-frame-hooks';
import SettingsIcon from '@material-ui/icons/Settings';
import { useRouter, Frame } from '../frame-router';
import { grey } from '@material-ui/core/colors';

const mainGlowSize = 4;

const useStyles = makeStyles(theme => createStyles({
  root: {
    overflow: 'hidden',
    padding: mainGlowSize
  },
  mainFrame: {
    position: 'fixed',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    width: uiConfig.appWidth - mainGlowSize * 2,
    minHeight: uiConfig.appIdleHeight - mainGlowSize * 2,
    zIndex: 100,
    '-webkit-app-region': 'drag',
    boxShadow: `0px 0px ${mainGlowSize}px 0px ${theme.palette.primary.dark}`
  },
  settings: {
    position: 'absolute',
    top: 1,
    right: 1,
    color: grey[800],
    zIndex: 200,
    '-webkit-app-region': 'no-drag',
    '&:hover': {
      color: theme.palette.primary.light
    }
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
}));

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
  const switchFrame = useRouter();
  const requestMinimize = useApiAction(actions.minimize, () => { });
  useWindowsSizeFix(result.items.length);
  useApiListener(actions.appMinimizedByBlur, async () => {
    resetData();
  });

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
        <IconButton className={classes.settings} size='small' onClick={() => switchFrame(Frame.settings)}>
          <SettingsIcon fontSize='inherit' />
        </IconButton>
      </Paper>
      <ResultsList
        children={result.items.map((x, i) =>
          <ResultListItem
            key={x.value}
            selected={i === selection.selectedIndex}
            icon={x.icon}
            matches={x.matches}
            value={x.display}
            helperText={x.secondaryText || x.value}
            onClick={launchSelected} />)} />
    </div>
  </Configurator>;
});
