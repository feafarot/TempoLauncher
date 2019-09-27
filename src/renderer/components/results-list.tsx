import React, { memo } from 'react';
import { Paper, List } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { uiConfig } from 'shared/ui-config';

type ResultsListProps = {
  children?: React.ReactNode[];
};

const maxHeight = uiConfig.itemHeight * uiConfig.maxItemsShown;
const useStyles = makeStyles({
  menuPaper: {
    marginTop: uiConfig.appIdleHeight,
    maxHeight: maxHeight,
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
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0
  }
});

export const ResultsList: React.FC<ResultsListProps> = memo(({ children, ...props }) => {
  const classes = useStyles();
  return <Paper className={classes.menuPaper}>
    <List className={classes.list} dense>
      {children}
    </List>
  </Paper>;
});
