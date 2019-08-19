import React, { useLayoutEffect } from 'react';
import { isArray } from 'util';
import { MenuList, MenuItem, Paper } from '@material-ui/core';
import { fitContent } from 'shared/utils';
import { makeStyles } from '@material-ui/styles';

type ResultsListProps = {
  children?: React.ReactNode[];
};

const useStyles = makeStyles({
  menu: {
    maxHeight: 500,
    //overflowY: 'scroll'
  }
});

export const ResultsList: React.FC<ResultsListProps> = ({ children, ...props }) => {
  const classes = useStyles();
  useLayoutEffect(() => {
    fitContent();
  });

  if (!isArray(children) || children.length === 0) {
    return null;
  }

  return <Paper>
    <MenuList className={classes.menu}>
      {children.map((x, i) =>
        <MenuItem key={i}>{x}</MenuItem>)}
    </MenuList>
  </Paper>;
};
