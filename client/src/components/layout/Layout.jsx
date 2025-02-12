import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Box, Container, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { user } = useAuth();
  const isDesktop = useMediaQuery('(min-width:600px)');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseSidebar = () => {
    setMobileOpen(false);
  };

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleDrawerToggle} mobileOpen={mobileOpen} />
      <Sidebar 
        mobileOpen={mobileOpen} 
        onClose={handleCloseSidebar}
        variant={isDesktop ? 'permanent' : 'temporary'}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)`, md: '800px' },
          mt: 8,
          backgroundColor: 'background.default'
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 