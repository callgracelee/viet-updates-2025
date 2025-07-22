import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo-hooks';
// import { HttpLink } from 'apollo-link-http';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './theme';
import 'typeface-roboto';
import App from './App';
import * as serviceWorker from './serviceWorker';

// const retry = new RetryLink({ attempts: { max: 5 } });

// const httpLink = new HttpLink({
//   uri: 'http://localhost:4000',
//   options: {
//     reconnect: true,
//     timeout: 3000
//   }
// });
// const link = concat(retry, http);

const client = new ApolloClient({ uri: 'http://localhost:4000' });

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </ApolloProvider>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
