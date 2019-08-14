import React, { useLayoutEffect } from 'react';
import { isArray } from 'util';
import { MenuList, MenuItem, Paper } from '@material-ui/core';
import { fitContent } from 'shared/utils';

type ResultsListProps = {
  children?: React.ReactNode[];
};

export const ResultsList: React.FC<ResultsListProps> = ({ children, ...props }) => {
  useLayoutEffect(() => {
    fitContent();
  });

  if (!isArray(children) || children.length === 0) {
    return null;
  }

  return <Paper>
    <MenuList>
      {children.map((x, i) =>
        <MenuItem key={i}>{x}</MenuItem>)}
    </MenuList>
  </Paper>;
};
