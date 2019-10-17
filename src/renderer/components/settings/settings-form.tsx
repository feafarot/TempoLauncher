import * as React from 'react';
import { useRouter, Frame } from '../frame-router';
import { Formik, FormikHelpers } from 'formik';
import { Button, Grid, FormControl, FormLabel, makeStyles, createStyles, Typography } from '@material-ui/core';
import { AppSettings } from 'shared/app-settings';
import { useSettingsAutoResize } from './settings-hooks';
import { SettingsModel, createModel, createSettingsFromModel } from './settings-model';
import { useMemo } from 'react';
import { AppOpenHotkeyEdit } from './app-hotkey-edit';
import { SearchFoldersEdit } from './search-folders-edit';
import { useApiAction } from 'renderer/api';
import { actions } from 'shared/contracts/actions';

const useStyles = makeStyles((theme) => createStyles({
  cancelBtn: {
    marginRight: theme.spacing(2)
  }
}));

export const SettingsForm: React.FC<{ settings: AppSettings }> = React.memo(({ settings }) => {
  const classes = useStyles();
  const switchFrame = useRouter();
  const initSettings = useMemo(() => createModel(settings), [settings]);
  const saveSettings = useApiAction(actions.saveSettings, () => { });
  useSettingsAutoResize([settings]);

  const handleSubmit = React.useCallback(
    (values: SettingsModel, helpers: FormikHelpers<SettingsModel>) => {
      console.log(values);
      saveSettings({ settings: createSettingsFromModel(values) });
      switchFrame(Frame.search);
    },
    [settings]);
  return <Formik initialValues={initSettings} onSubmit={handleSubmit} render={(fprops) =>
    <FormControl component='form' onSubmit={fprops.handleSubmit}>
      <Grid container spacing={1}>
        <Grid container item xs={12} justify='flex-end'>
          <FormLabel><Typography variant='subtitle2'>TempoLauncher Settings</Typography></FormLabel>
        </Grid>
        <AppOpenHotkeyEdit />
        <SearchFoldersEdit />
        <Grid container item xs={12} direction='row' justify='flex-end'>
          <Button variant='outlined' className={classes.cancelBtn} onClick={() => switchFrame(Frame.search)}>Cancel</Button>
          <Button type='submit' variant='contained' color='primary'>Save</Button>
        </Grid>
      </Grid>
    </FormControl>} />;
  });
