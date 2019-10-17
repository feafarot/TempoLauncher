import React, { memo } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, createMuiTheme, makeStyles } from '@material-ui/core';
import { lightBlue, blue, pink, grey } from '@material-ui/core/colors';

const theme = createMuiTheme({
  props: {
    MuiButton: {
      size: 'small',
    },
    MuiFilledInput: {
      margin: 'dense',
    },
    MuiFormControl: {
      margin: 'dense',
    },
    MuiFormHelperText: {
      margin: 'dense',
    },
    MuiIconButton: {
      size: 'small',
    },
    MuiInputBase: {
      margin: 'dense',
    },
    MuiInputLabel: {
      margin: 'dense',
    },
    MuiListItem: {
      dense: true,
    },
    MuiOutlinedInput: {
      margin: 'dense',
    },
    MuiFab: {
      size: 'small',
    },
    MuiTable: {
      size: 'small',
    },
    MuiTextField: {
      margin: 'dense',
    },
    MuiToolbar: {
      variant: 'dense',
    },
  },
  overrides: { },
  palette: {
    type: 'dark',
    primary: blue,
    secondary: pink,
    background: {
      default: 'rgba(0,0,0,0)',
      paper: grey[900]
    }
  }
});

const useGlobalStyles = makeStyles({
  '@global': {
    'body': {
      overflow: 'hidden',
      //height: 60
    },
    '*': {
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
  }
});

export const Configurator: React.FC = memo(({ children, ...props }) => {
  useGlobalStyles();
  return <ThemeProvider theme={theme}>
    <CssBaseline>
      <>{children}</>
    </CssBaseline>
  </ThemeProvider>;
});
