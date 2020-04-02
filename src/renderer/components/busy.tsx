import * as React from 'react';
import { useContext, createContext, FC } from 'react';
import { Fade, CircularProgress, CircularProgressProps } from '@material-ui/core';
import { DR } from 'renderer/utils/type-helpers';
import { cns } from 'renderer/utils/lib-refs';

const defaultBusy: unique symbol = Symbol('DefaultBusy');

type BusyIdType = string | symbol;

interface BusyInstance {
  isBusy: boolean;
  messages: string[];
}

type BusyGlobalState = DR<{
  [key in BusyIdType]: BusyInstance;
}>;

type BusyContext = DR<{
  instances: BusyGlobalState;
  show(message?: string, busyId?: BusyIdType): () => void;
  hide(busyId?: BusyIdType): void;
}>;

const context = createContext<DR<BusyContext>>({
  instances: {},
  show: () => (() => { }),
  hide: () => { },
});

export function useBusy() {
  const ctx = useContext(context);
  return ctx;
}

export const BusyProvider: FC = React.memo((props) => {
  const [state, setState] = React.useState<BusyGlobalState>({
    [defaultBusy]: { isBusy: false, messages: [] }
  });
  const show = React.useCallback(
    (message?: string, busyId?: BusyIdType) => {
      const targetBusy = state[(busyId || defaultBusy) as unknown as string];
      setState({
        ...state, [busyId || defaultBusy]: {
          isBusy: true,
          messages: [...targetBusy.messages, message || '']
      } });
      return () => {
        //setState()
      };
    },
    []);
  const value = React.useMemo<DR<BusyContext>>(
    () => ({
      instances: state,
      show: show,
      hide() {}
    }),
    [state]);
  return <context.Provider value={value}>
    {props.children}
  </context.Provider>;
});

export interface BusyIndicatorProps {
  busyId?: BusyIdType;
  className?: string;
  progressProps?: CircularProgressProps;
}

export const BusyIndicator: FC<BusyIndicatorProps> = React.memo((props) => {
  const mergedProps: Partial<CircularProgressProps> = {
    ...props.progressProps,
    className: cns(props.progressProps?.className, props.className)
  };
  return <Fade>
    <CircularProgress {...mergedProps} />
  </Fade>;
});
