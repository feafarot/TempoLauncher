import React, { memo, useCallback } from 'react';
import { Paper, IconButton, Box } from '@material-ui/core';
import { QueryInput, QueryInputActionInfo } from './query-input';
import { ResultsList } from '../results/results-list';
import { Configurator } from '../configurator';
import { useApiAction, useApiListener, useApiActionAsync } from 'renderer/api';
import { actions } from 'shared/contracts/actions';
import { ResultListItem } from '../results/result-list-item';
import { useSelectionControl, useWindowsSizeFix, useQuerying } from './search-frame-hooks';
import SettingsIcon from '@material-ui/icons/Settings';
import { useRouter, Frame } from '../frame-router';
import { DataItem } from 'shared/contracts/search';
import { AppImage } from '../image';
import { KeyCodes } from 'renderer/key-codes';
import { BusyIndicator, useBusyActions } from '../busy';
import { useSearchFrameStyles } from './search-frame.styles';

function getPluginKey(plugin: DataItem | null) {
  return plugin ? plugin.value : undefined;
}

export const SearchFrame: React.FC = memo(() => {
  const classes = useSearchFrameStyles();
  const { show: showBusy, hide: hideBusy } = useBusyActions();

  const { query, activePluginInfo, handleChange, result, setActivePlugin, resetData } = useQuerying();
  const selection = useSelectionControl(result.items);
  const handleChangeWrapped = useCallback(
    (actionInfo: QueryInputActionInfo) => {
      selection.reset();
      handleChange(actionInfo);
    },
    []);
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
  const rebuildIndex = useApiActionAsync(actions.rebuildIndex);
  const rebuildIndexWrapped = useCallback(
    async () => {
      const hide = showBusy();
      await rebuildIndex();
      hide();
    },
    []);
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
      if (result.calc != null) {
        document.execCommand('copy');
        return;
      }

      const target = result.items[selection.selectedIndex];
      if (target.isPluginSelector) {
        selectPlugin();
        return;
      }

      const targetId = target.id;
      requestLaunch({ targetId, queryObj: { query, pluginKey: getPluginKey(activePluginInfo) } });
    },
    [result, activePluginInfo, selection.selectedIndex]);

  const createLaunchByClickHandler = useCallback(
    (index: number) =>
      () => {
        selection.setIndex(index);
        launchSelected();
      },
    [launchSelected]);

  function onContainerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.keyCode) {
      case KeyCodes.ArrowUp:
        selection.handleUp();
        break;
      case KeyCodes.ArrowDown:
        selection.handleDown();
        break;
      case KeyCodes.Enter:
        launchSelected();
        break;
      case KeyCodes.F5:
        rebuildIndexWrapped();
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
          <QueryInput query={query} onChange={handleChangeWrapped} className={classes.queryInput} />
          {result.calc
            && <span className={classes.mathResult}> = {result.calc}</span>}
        </div>
        <IconButton className={classes.settings} size='small' onClick={() => switchFrame(Frame.settings)}>
          <SettingsIcon fontSize='inherit' />
        </IconButton>
        <BusyIndicator className={classes.busy} />
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
            onClick={createLaunchByClickHandler(i)} />)} />
    </div>
  </Configurator>;
});
