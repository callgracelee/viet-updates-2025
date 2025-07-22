import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
function Layout({ children }) {
  return (
    <div className="App">
      <header>
        <Typography align="center">
          <NavLink to="/">Lesson Builder</NavLink>
        </Typography>
      </header>
      <Container maxWidth="md">{children}</Container>
    </div>
  );
}

export default withRouter(Layout);
