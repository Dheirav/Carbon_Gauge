import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/calculations/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(response.data);
      } catch (err) {
        setError('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // Prepare data for the chart
  const labels = history.map(item => new Date(item.createdAt).toLocaleDateString()); // Assuming createdAt is a date
  const emissionsData = history.map(item => item.totalEmission);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Emission (kg CO₂)',
        data: emissionsData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Overview
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Total Emissions Over Time</Typography>
        <Bar data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </Paper>
    </Box>
  );
};

export default Analytics; 