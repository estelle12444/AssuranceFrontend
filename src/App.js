import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Simulation from './components/insurance/Simulation';
import Subscription from './components/insurance/Subscription';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976a4',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/subscription" element={<Subscription />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 