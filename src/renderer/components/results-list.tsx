import React, { useLayoutEffect, memo } from 'react';
import { isArray } from 'util';
import { MenuList, MenuItem, Paper } from '@material-ui/core';
import { fitContent } from 'shared/utils';
import { makeStyles } from '@material-ui/styles';

type ResultsListProps = {
  selectedIndex?: number;
  children?: React.ReactNode[];
};

const useStyles = makeStyles({
  menuPaper: {
    maxHeight: 500,
    overflowY: 'scroll',
    overflowX: 'hidden',
    //scroll
    '&::-webkit-scrollbar': {
      width: '0.5em'
    },
    '&::-webkit-scrollbar-track': {
      borderRadius: 2,
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 2,
      backgroundColor: 'rgba(255,255,255,.3)',
      outline: '1px solid white'
    }
  }
});

export const ResultsList: React.FC<ResultsListProps> = memo(({ children, selectedIndex: selected, ...props }) => {
  const classes = useStyles();
  useLayoutEffect(() => {
    fitContent();
  });

  if (!isArray(children) || children.length === 0) {
    return null;
  }

  return <Paper className={classes.menuPaper}>
    <MenuList>
      {children.map((x, i) =>
        <MenuItem key={i} selected={selected === i}>{x}</MenuItem>)}
    </MenuList>
  </Paper>;
});
