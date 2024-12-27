import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            NSIAGO'ASSUR- PASCALE
          </Typography>
          <Button color="inherit" component={RouterLink} to="/simulation">
            Simulation
          </Button>
          <Button color="inherit" component={RouterLink} to="/subscription">
            Souscription
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 