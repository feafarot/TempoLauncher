import { makeStyles, createStyles } from '@material-ui/core/styles';
import { uiConfig } from 'shared/ui-config';
import { grey } from '@material-ui/core/colors';

export const useSearchFrameStyles = makeStyles(theme => createStyles({
  root: {
    overflow: 'hidden',
    padding: uiConfig.mainGlowSize
  },
  mainFrame: {
    position: 'fixed',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    width: uiConfig.appWidth - uiConfig.mainGlowSize * 2,
    minHeight: uiConfig.appIdleHeight - uiConfig.mainGlowSize * 2,
    maxHeight: uiConfig.appIdleHeight - uiConfig.mainGlowSize * 2,
    zIndex: 100,
    '-webkit-app-region': 'drag',
    boxShadow: `0px 0px ${uiConfig.mainGlowSize}px 0px ${theme.palette.primary.dark}`
  },
  settings: {
    position: 'absolute',
    top: 1,
    right: 1,
    color: grey[800],
    zIndex: 200,
    '-webkit-app-region': 'no-drag',
    '&:hover': {
      color: theme.palette.primary.light
    }
  },
  query: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    height: '100%',
    '-webkit-app-region': 'no-drag',
    marginLeft: 20
  },
  queryPlugin: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    height: '100%',
  },
  queryInput: {
    flexGrow: 1
  },
  pluginImg: {
    verticalAlign: 'middle'
  },
  mathResult: {
    position: 'absolute',
    fontSize: '11px',
    bottom: 6
  },
  busy: {
    position: 'absolute',
    right: 5,
    bottom: 5
  }
}));
