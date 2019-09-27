import React, { FC, memo } from 'react';
import { Configurator } from './configurator';
import { FrameRouter } from './frame-router';

export const Root: FC = memo(() => {
  return <Configurator>
    <FrameRouter />
  </Configurator>;
});
