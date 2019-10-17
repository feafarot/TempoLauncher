import * as React from 'react';
import { Paper, makeStyles, createStyles } from '@material-ui/core';
import { useSettingsAutoResize, useSettingsLoader } from './settings-hooks';
import { SettingsForm } from './settings-form';

const useStyles = makeStyles((theme) => createStyles({
  paper: {
    padding: theme.spacing(2),
    overflowY: 'scroll',
    overflowX: 'hidden',
    maxHeight: 400
  }
}));

export const SettingsFrame: React.FC = React.memo(() => {
  const classes = useStyles();
  const settings = useSettingsLoader();
  useSettingsAutoResize([settings]);
  return <Paper className={classes.paper}>
    {settings == null
      ? <span>Loading...</span>
      : <SettingsForm settings={settings} />}
  </Paper>;
});
