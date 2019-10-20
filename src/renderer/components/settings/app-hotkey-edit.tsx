import * as React from 'react';
import { useFormikContext } from 'formik';
import { SettingsModel } from './settings-model';
import { Grid, FormControlLabel, Checkbox } from '@material-ui/core';
import { ShortcutInput } from './shortcut-input';
import { defaultTextFieldProps } from './material-defaults';

export const AppOpenHotkeyEdit: React.FC = React.memo(() => {
  const formik = useFormikContext<SettingsModel>();
  const model = formik.values;
  return <Grid item container alignItems='center' spacing={3}>
    <Grid item xs={6}>
      <ShortcutInput keysSequence={model.launchHotkeySequence} textField={{ ...defaultTextFieldProps, label: 'App open hotkey' }}
        onHotkeySelected={React.useCallback((seq) => {
          formik.setFieldValue('launchHotkeySequence', seq);
        }, [])} />
    </Grid>
    <Grid item xs={6}>
      <FormControlLabel
        label={`Append 'Windows' key`}
        control={<Checkbox checked={model.hotkeyWithWinKey}
        onChange={() => formik.setFieldValue('hotkeyWithWinKey', !model.hotkeyWithWinKey)} />} />
    </Grid>
  </Grid>;
});
