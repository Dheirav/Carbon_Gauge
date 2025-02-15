import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Configurations = () => {
  const [threshold, setThreshold] = useState(10);
  const [theme, setTheme] = useState('light');

  const handleSave = () => {
    // Save configuration settings (e.g., via API or local storage)
    console.log('Saved configurations:', { threshold, theme });
    alert('Configurations saved successfully!');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        App Configurations
      </Typography>
      <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
        <TextField 
          label="Compliance Threshold (kg CO₂)" 
          type="number" 
          value={threshold} 
          onChange={(e) => setThreshold(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="theme-label">Theme</InputLabel>
          <Select
            labelId="theme-label"
            value={theme}
            label="Theme"
            onChange={(e) => setTheme(e.target.value)}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSave}>
          Save Configurations
        </Button>
      </Box>
    </Paper>
  );
};

export default Configurations; 