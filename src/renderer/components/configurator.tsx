import React, { memo } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: 'rgba(0,0,0,0)'
    }
  }
});

export const Configurator: React.FC = memo(({ children, ...props }) => {
  return <ThemeProvider theme={theme}>
    <CssBaseline>
      <>{children}</>
    </CssBaseline>
  </ThemeProvider>;
});
