import React from 'react';
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
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32', // Green shade for environmental theme
    },
    secondary: {
      main: '#2a7a45',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
