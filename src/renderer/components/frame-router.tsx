import React, { memo, FC, createContext, useState, useContext, useCallback } from 'react';
import { SearchFrame } from './search/search-frame';
import { SettingsFrame } from './settings/settings-frame';

export enum Frame {
  search,
  settings
}

interface RouterContext {
  activeFrame: Frame;
  switch: (frame: Frame) => void;
}

const context = createContext<RouterContext>({ activeFrame: Frame.search, switch: () => { } });

export const RouterContext = context;

export function useRouter() {
  const ctx = useContext(RouterContext);
  return ctx.switch;
}

export const FrameRouter: FC = memo(() => {
  const [activeFrame, setFrame] = useState(Frame.search);
  const cbSetFrame = useCallback(setFrame, []);
  return <context.Provider value={{ activeFrame, switch: cbSetFrame }}>
    {activeFrame === Frame.search &&
      <SearchFrame />}
    {activeFrame === Frame.settings &&
      <SettingsFrame />}
  </context.Provider>;
});
