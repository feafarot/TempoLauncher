import React, { memo } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, createMuiTheme, makeStyles } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: 'rgba(0,0,0,0)'
    }
  }
});

const useGlobalStyles = makeStyles({
  '@global': {
    'body': {
      overflow: 'hidden',
      height: 60
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
