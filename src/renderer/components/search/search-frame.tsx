import React, { memo, useCallback } from 'react';
import { makeStyles, Paper, IconButton, createStyles, Box } from '@material-ui/core';
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
import { DataItem } from 'shared/contracts/search';
import { AppImage } from '../image';
import { KeyCodes } from 'renderer/key-codes';

const useStyles = makeStyles(theme => createStyles({
  root: {
    overflow: 'hidden',
    padding: uiConfig.mainGlowSize
  },
  mainFrame: {
    position: 'fixed',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    width: uiConfig.appWidth - uiConfig.mainGlowSize * 2,
    minHeight: uiConfig.appIdleHeight - uiConfig.mainGlowSize * 2,
    maxHeight: uiConfig.appIdleHeight - uiConfig.mainGlowSize * 2,
    zIndex: 100,
    '-webkit-app-region': 'drag',
    boxShadow: `0px 0px ${uiConfig.mainGlowSize}px 0px ${theme.palette.primary.dark}`
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    height: '100%',
    '-webkit-app-region': 'no-drag',
    marginLeft: 20
  },
  queryPlugin: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    height: '100%',
  },
  queryInput: {
    flexGrow: 1
  },
  pluginImg: {
    verticalAlign: 'middle'
  },
  mathResult: {
    position: 'absolute',
    fontSize: '11px',
    bottom: 6
  }
}));

function getPluginKey(plugin: DataItem | null) {
  return plugin ? plugin.value : undefined;
}

export const SearchFrame: React.FC = memo(() => {
  const classes = useStyles();
  const { query, activePluginInfo, handleChange, result, setActivePlugin, resetData } = useQuerying();
  const selection = useSelectionControl(result.items);
  const requestLaunch = useApiAction(actions.launch, (resp) => {
    if (resp.success) {
      resetData();
      selection.reset();
    }
  });
  const requestPluginLaunch = useApiAction(actions.launch, (resp) => {
    selection.reset();
  });
  const switchFrame = useRouter();
  const requestMinimize = useApiAction(actions.minimize, () => { });
  const rebuildIndex = useApiAction(actions.rebuildIndex, () => { });
  const resetDataIfNotCalc = useCallback(
    () => {
      resetData(!!result.calc);
    },
    [result]);

  useWindowsSizeFix(result.items.length);
  useApiListener(actions.appMinimizedByBlur, async () => {
    resetDataIfNotCalc();
  });

  const selectPlugin = useCallback(
    () => {
      const selectedItem = result.items[selection.selectedIndex];
      if (selectedItem.isPluginSelector) {
        setActivePlugin(selectedItem);
        requestPluginLaunch({ targetId: selectedItem.id, queryObj: { query, pluginKey: getPluginKey(selectedItem) } });
      }
    },
    [result, selection.selectedIndex]);

  const launchSelected = useCallback(
    () => {
      const target = result.items[selection.selectedIndex];
      if (target.isPluginSelector) {
        selectPlugin();
        return;
      }

      const targetId = target.id;
      requestLaunch({ targetId, queryObj: { query, pluginKey: getPluginKey(activePluginInfo) } });
    },
    [result, activePluginInfo, selection.selectedIndex]);

  function onContainerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.keyCode) {
      case KeyCodes.ArrowUp:
        selection.handleUp();
        break;
      case KeyCodes.ArrowUp:
        selection.handleDown();
        break;
      case KeyCodes.Enter:
        launchSelected();
        break;
      case KeyCodes.F5:
        rebuildIndex();
        break;
      case KeyCodes.Esc:
        requestMinimize();
        resetDataIfNotCalc();
        break;
      case KeyCodes.Tab:
        if (!e.shiftKey) {
          selectPlugin();
        }

        break;
    }
  }

  return <Configurator>
    <div className={classes.root} onKeyDown={onContainerKeyDown}>
      <Paper className={classes.mainFrame}>
        <div className={classes.query}>
          {activePluginInfo != null &&
            <div className={classes.queryPlugin}>
              <Box pr={1}><AppImage src={activePluginInfo.icon} size={25} className={classes.pluginImg} /></Box>
              <span>{activePluginInfo!.display}</span>
              <span>&nbsp;{'>'}&nbsp;</span>
            </div>}
          <QueryInput query={query} onChange={handleChange} className={classes.queryInput} />
          {result.calc
            && <span className={classes.mathResult}> = {result.calc}</span>}
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
