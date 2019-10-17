import { useApiAction } from 'renderer/api';
import { actions } from 'shared/contracts/actions';
import { uiConfig } from 'shared/ui-config';
import { useEffect, useState } from 'react';
import { AppSettings } from 'shared/app-settings';

// tslint:disable-next-line: no-any
export function useSettingsAutoResize(dependencies?: any[]) {
  const requestResize = useApiAction(actions.resize, () => {});

  useEffect(
    () => {
      setTimeout(
        () => {
          requestResize({ width: uiConfig.appWidth, height: document.body.scrollHeight });
        },
        0);
    },
    dependencies);
}

export function useSettingsLoader() {
  const [[loading, loaded], setLoading] = useState([false, false]);
  const [state, setState] = useState<AppSettings>();
  const loadSettings = useApiAction(actions.getSettings, (resp) => {
    setState(resp.settings);
    setLoading([true, true]);
  });
  useEffect(() => {
    if (loaded) {
      return;
    }

    if (!loading) {
      loadSettings();
      setLoading([true, false]);
    }
    else if (loading && !!state) {
      setLoading([true, true]);
    }
  });
  return state;
}
