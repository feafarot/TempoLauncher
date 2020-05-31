import * as React from 'react';
import { useContext, createContext, FC } from 'react';
import { Fade, CircularProgress, CircularProgressProps } from '@material-ui/core';
import { DR } from 'renderer/utils/type-helpers';
import { cns } from 'renderer/utils/lib-refs';

const defaultBusy: unique symbol = Symbol('DefaultBusy');

type BusyId = string | symbol;

interface BusyInstance {
  isBusy: boolean;
  messages: (string | null)[];
}

type BusyGlobalState = DR<{
  [key in BusyId]: BusyInstance;
}>;

type BusyContext = BusyGlobalState;

interface BusyActionContext {
  show(message?: string, busyId?: BusyId): () => void;
  hide(busyId?: BusyId): void;

}

const nativeBusyContext = createContext<BusyContext>({});

const nativeBusyActionContext = createContext<BusyActionContext>({
  show: () => (() => { }),
  hide: () => { }
});

export function useBusy() {
  const ctx = useContext(nativeBusyContext);
  return ctx;
}
export function useBusyById(busyId?: BusyId) {
  const ctx = useContext(nativeBusyContext);
  return ctx[getActualId(busyId)];
}

export function useBusyActions() {
  return useContext(nativeBusyActionContext);
}

function getActualId(busyId?: BusyId) {
  return (busyId || defaultBusy) as unknown as string;
}
let tid = 0;
export const BusyProvider: FC = React.memo(({ children }) => {
  const [state, setState] = React.useState<BusyGlobalState>(() => ({
    [defaultBusy]: { isBusy: false, messages: [] }
  }));
  const cid = React.useMemo(() => tid++, []);
  const show = React.useCallback(
    (message?: string, busyId?: BusyId) => {
      const id = getActualId(busyId);
      setState(s => {
        return {
          ...s,
          [id]: {
            isBusy: true,
            messages: [...s[id].messages, message || null]
          }
        };
      });
      return () => {
        setState(s => {
          const current = s[id];
          const msgIndex = current.messages.indexOf(message || null);
          const newMsgs = current.messages.filter((_, i) => i != msgIndex);
          return {
            ...show,
            [id]: {
              isBusy: newMsgs.length > 0,
              messages: newMsgs
            }
          };
        });
      };
    },
    [state]);
//
  const hide = React.useCallback(
    (busyId?: BusyId) => {
      const id = getActualId(busyId);
      setState({
        ...state,
        [id]: {
          isBusy: false,
          messages: []
        }
      });
    },
    [state]);

  // const value = React.useMemo<DR<BusyContext>>(
  //   () => (state),
  //   [state]);

  return <nativeBusyContext.Provider value={state}>
    <nativeBusyActionContext.Provider value={{ show, hide }}>
      {children}
    </nativeBusyActionContext.Provider>
  </nativeBusyContext.Provider>;
});

export interface BusyIndicatorProps {
  busyId?: BusyId;
  className?: string;
  progressProps?: CircularProgressProps;
}

export const BusyIndicator: FC<BusyIndicatorProps> = React.memo(({ busyId, ...props }) => {
  const mergedProps: Partial<CircularProgressProps> = {
    size: 15,
    ...props.progressProps,
    className: cns(props.progressProps?.className, props.className)
  };
  const busyState = useBusyById(busyId);
  const show = busyState?.isBusy || false;
  // if (!show) {
  //   return null;
  // }

  return <Fade in={show}>
    <CircularProgress {...mergedProps} />
  </Fade>;
});
