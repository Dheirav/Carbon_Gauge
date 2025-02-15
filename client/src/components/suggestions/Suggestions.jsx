import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const suggestions = [
  { id: 1, text: "Reduce machine idle time to lower electrical emissions." },
  { id: 2, text: "Optimize cutting speed to decrease tool wear and energy use." },
  { id: 3, text: "Review and adjust coolant usage to improve process efficiency." },
  { id: 4, text: "Consider alternative materials that yield lower embodied emissions." },
  { id: 5, text: "Regularly maintain machinery to ensure it operates at peak efficiency." },
];

const Suggestions = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Suggestions & Improvements
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          Based on your emission data, consider the following suggestions:
        </Typography>
        <List>
          {suggestions.map(suggestion => (
            <ListItem key={suggestion.id}>
              <ListItemText primary={suggestion.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default Suggestions; 