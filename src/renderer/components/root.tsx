import React, { FC, memo } from 'react';
import { Configurator } from './configurator';
import { FrameRouter } from './frame-router';
import { BusyProvider } from './busy';

export const Root: FC = memo(() => {
  return <Configurator>
    <BusyProvider key={0}>
      <FrameRouter />
    </BusyProvider>
  </Configurator>;
});
