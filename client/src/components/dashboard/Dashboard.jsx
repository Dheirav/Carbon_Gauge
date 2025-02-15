import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [recentCalculations, setRecentCalculations] = useState([]);
  const [overview, setOverview] = useState({ average: 0, total: 0 });

  useEffect(() => {
    const fetchRecentCalculations = async () => {
      try {
        const response = await axios.get('/api/calculations/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Only take the last 5 records (sorted by descending date assumed)
        const history = response.data;
        setRecentCalculations(history.slice(0, 5));
        if (history.length > 0) {
          const totalEmissionSum = history.reduce((sum, record) => sum + record.totalEmission, 0);
          const avg = totalEmissionSum / history.length;
          setOverview({ total: totalEmissionSum, average: avg });
        }
      } catch (error) {
        console.error('Error fetching recent calculations:', error);
      }
    };

    fetchRecentCalculations();
  }, [token]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Calculations</Typography>
            {recentCalculations.length > 0 ? (
              <List>
                {recentCalculations.map((record) => (
                  <ListItem key={record._id}>
                    <ListItemText
                      primary={new Date(record.createdAt).toLocaleDateString()}
                      secondary={`Total Emission: ${record.totalEmission.toFixed(2)} kg CO₂`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No recent calculations found.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Emissions Overview</Typography>
            {recentCalculations.length > 0 ? (
              <Box>
                <Typography variant="body1">
                  Average Total Emission: {overview.average.toFixed(2)} kg CO₂
                </Typography>
                <Typography variant="body1">
                  Total Emission Sum: {overview.total.toFixed(2)} kg CO₂
                </Typography>
              </Box>
            ) : (
              <Typography>No emission data available.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 