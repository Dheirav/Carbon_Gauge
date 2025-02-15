import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
  Avatar,
  ListSubheader,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Calculate as CalculateIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  BarChart as AnalyticsIcon,
  EmojiObjects as SuggestionsIcon,
  CloudDownload as ExportIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  {
    group: 'Main',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
      { text: 'Calculator', icon: <CalculateIcon />, path: '/calculator' },
      { text: 'History', icon: <HistoryIcon />, path: '/history' }
    ]
  },
  {
    group: 'Analysis',
    items: [
      { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
      { text: 'Export Data', icon: <ExportIcon />, path: '/export' }
    ]
  },
  {
    group: 'Support',
    items: [
      { text: 'Suggestions', icon: <SuggestionsIcon />, path: '/suggestions' },
      { text: 'Help', icon: <HelpIcon />, path: '/help' },
      { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
    ]
  }
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) onClose(); // Close sidebar on mobile when navigating
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Close Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
        <Avatar 
          sx={{ 
            width: 40, 
            height: 40,
            bgcolor: theme.palette.primary.main 
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} User
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 1 }}>
        {menuItems.map((group) => (
          <List
            key={group.group}
            subheader={
              <ListSubheader component="div" sx={{ bgcolor: 'background.paper' }}>
                {group.group}
              </ListSubheader>
            }
          >
            {group.items.map((item) => {
              // Skip industrial-only items for regular users
              if (item.industrial && user?.role !== 'industrial') {
                return null;
              }

              return (
                <Tooltip 
                  key={item.text} 
                  title={item.text}
                  placement="right"
                  arrow
                >
                  <ListItem
                    button
                    selected={location.pathname === item.path}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      '&.Mui-selected, &.Mui-selected:hover': {
                        backgroundColor: theme.palette.primary.main,
                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                          color: theme.palette.primary.contrastText,
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        justifyContent: 'center',
                        color: location.pathname === item.path ? 'primary.main' : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: location.pathname === item.path ? 'primary.main' : 'inherit',
                      }}
                    />
                  </ListItem>
                </Tooltip>
              );
            })}
          </List>
        ))}
      </Box>

      {/* Version Info */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="textSecondary">
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { sm: drawerWidth }, 
        flexShrink: { sm: 0 },
        transition: 'transform 0.3s ease',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        '&::-webkit-scrollbar': {
          width: '8px', // Width of the scrollbar
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.background.default, // Background of the scrollbar track
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.primary.main, // Color of the scrollbar thumb
          borderRadius: '4px', // Rounded corners for the scrollbar thumb
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.primary.dark, // Darker color on hover
        },
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        transitionDuration={500}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            transition: 'transform 0.3s ease-out',
          }
        }}
      >
        {drawer}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            borderRight: '1px solid',
            borderColor: 'divider'
          }
        }}
        open={mobileOpen}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar; 