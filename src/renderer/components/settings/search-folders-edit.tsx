import React from 'react';
import { FieldArray, useFormikContext, Field, FieldProps, FastField } from 'formik';
import { SettingsModel } from './settings-model';
import { Grid, TextField, IconButton, Box, GridList, Typography, Button } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import { defaultTextFieldProps } from './material-defaults';
import { SettingsSearchPattern } from 'shared/app-settings';

function createDefaultPattern(): SettingsSearchPattern {
  return {
    extensions: '',
    pattern: ''
  };
}

export const SearchFoldersEdit: React.FC = React.memo(() => {
  const { values } = useFormikContext<SettingsModel>();
  const patterns = values.searchPatterns;
  return <FieldArray
    name='searchPatterns'
    render={(helpers) => {
      return <>
        <Grid item xs={12} container alignItems='center'>
          <Typography variant='subtitle2'>Installed application search patterns</Typography>
        </Grid>
        {patterns.map((sp, i) =>
          <Grid key={i} item container xs={12} spacing={1} alignItems='center'>
            <Grid item xs={8}>
              <FastField
                name={`searchPatterns[${i}].pattern`}>
                {({ field }: FieldProps<SettingsModel>) =>
                  <TextField {...defaultTextFieldProps} label='Folder Path' fullWidth {...field} />}
              </FastField>
            </Grid>
            <Grid item xs={3}>
              <FastField
                name={`searchPatterns[${i}].extensions`}>
                {({ field }: FieldProps<SettingsModel>) =>
                  <TextField {...defaultTextFieldProps} label='Extensions' {...field} />}
              </FastField>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={helpers.handleRemove(i)} color='secondary'>
                <DeleteForever />
              </IconButton>
            </Grid>
          </Grid>)}
        <Grid item xs={12} alignItems='center'>
          <Button variant='outlined' color='primary' onClick={helpers.handlePush(createDefaultPattern())}>Add new pattern</Button>
        </Grid>
      </>;
    }} />;
});
