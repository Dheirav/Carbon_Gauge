import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { logout } = useAuth();

  return (
    <AppBar position="fixed" elevation={4} sx={{ backgroundColor: '#2E7D32', padding: '0 16px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <IconButton 
          color="inherit" 
          edge="start" 
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Carbon Gauge
        </Typography>
        <Button color="inherit" onClick={logout} sx={{ textTransform: 'none' }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 