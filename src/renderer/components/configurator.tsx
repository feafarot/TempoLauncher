import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    background: {
      default: 'rgba(0,0,0,0)'
    }
  }
});

export const Configurator: React.FC = ({ children, ...props }) => {
  return <ThemeProvider theme={theme}>
    <CssBaseline>
      <>{children}</>
    </CssBaseline>
  </ThemeProvider>;
};
