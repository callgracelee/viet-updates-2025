import { createMuiTheme } from '@material-ui/core/styles';

let theme = createMuiTheme({
  typography: {
    subtitle1: {
      fontSize: 12
    },
    body1: {
      fontWeight: 500
    },
    button: {},
    h3: {
      lineHeight: 2
    },
    h4: {
      lineHeight: 1.6,
      marginTop: '1em'
    }
  }
});

export { theme };
