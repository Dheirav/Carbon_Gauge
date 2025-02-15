import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Calculator from './components/calculator/Calculator';
import History from './components/history/History';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Analytics from './components/analytics/Analytics';
import Suggestions from './components/suggestions/Suggestions';
import ExportData from './components/export/ExportData';
import Settings from './components/settings/Settings';
import Help from './components/help/Help';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';

const App = () => {
  const [mode, setMode] = useState('light');
  const toggleTheme = () =>
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2E7D32', // same for light and dark modes
          },
          secondary: {
            main: '#2a7a45',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background: mode === 'light'
                  ? 'linear-gradient(to right, #f5f7fa, #c3cfe2)'
                  : '#121212',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <AuthProvider>
          <Router>
            <AppRoutes toggleTheme={toggleTheme} mode={mode} />
          </Router>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
};

function AppRoutes({ toggleTheme, mode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout toggleTheme={toggleTheme} mode={mode} />}>
        <Route index element={<Dashboard />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="history" element={<History />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="suggestions" element={<Suggestions />} />
        <Route path="export" element={<ExportData />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
