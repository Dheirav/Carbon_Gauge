import React from 'react';
import { Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';

const Help = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Help & Instructions
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          Welcome to the Carbon Emissions Calculator App! Here are some instructions to get you started:
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Calculator"
              secondary="Enter the required parameters in the Calculator to compute various emission components."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Dashboard"
              secondary="View a summary of your recent calculations along with the machine name, date, and total emissions."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Analytics"
              secondary="Review detailed charts that compare emission readings over time and check compliance against standards."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Export Data"
              secondary="Export your historical data in CSV, JSON, or XML format for further analysis."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Configurations"
              secondary="Customize app settings such as emission thresholds and theme options."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Suggestions"
              secondary="Get tailored suggestions aimed at reducing your emissions based on your data."
            />
          </ListItem>
        </List>
        <Typography variant="body1" sx={{ mt: 2 }}>
          For any further help, please contact support.
        </Typography>
      </Box>
    </Paper>
  );
};

export default Help; 