import React, { memo, FC, createContext, useState } from 'react';
import { SearchFrame } from './search/search-frame';

export enum Frame {
  search,
  settings
}

interface RouterContext {
  activeFrame: Frame;
  open: (frame: Frame) => void;
}

const context = createContext<RouterContext>({ activeFrame: Frame.search, open: () => { } });

export const RouterContext = context;

export const FrameRouter: FC = memo(() => {
  const [activeFrame, setFrame] = useState(Frame.search);
  return <context.Provider value={{ activeFrame, open: frame => setFrame(frame) }}>
    {activeFrame === Frame.search &&
      <SearchFrame />}
  </context.Provider>;
});
