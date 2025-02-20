import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Collapse,
  Box
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const History = () => {
  const { token, user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const endpoint = '/api/calculations/history';
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(response.data);
      } catch (err) {
        setError('Failed to fetch history: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token, user]);

  useEffect(() => {
    ChartJS.register(ArcElement, Tooltip, Legend);
  }, []);

  const handleToggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleClearHistory = async () => {
    try {
      await axios.delete('/api/calculations/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory([]); // Clear the local history state
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Calculation History
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Machine</TableCell>
              <TableCell>Total Emissions</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography>No history available.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              history.map((record) => (
                <React.Fragment key={record._id}>
                  <TableRow>
                    <TableCell>
                      {new Date(record.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {record.machineId?.manufacturer} - {record.machineId?.type}
                    </TableCell>
                    <TableCell>{record.totalEmission.toFixed(2)} kg CO₂</TableCell>
                    <TableCell>
                      <Button onClick={() => handleToggleRow(record._id)}>
                        {expandedRow === record._id ? 'Hide Details' : 'Show Details'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedRow === record._id} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom>Detailed Report</Typography>
                          <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                          }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography>Electrical Emission: {record.CEele.toFixed(2)} kg CO₂</Typography>
                                <Typography>Tool Emission: {record.CEtool.toFixed(2)} kg CO₂</Typography>
                                <Typography>Coolant Emission: {record.CEcoolant.toFixed(2)} kg CO₂</Typography>
                                <Typography>Material Emission: {record.CEm.toFixed(2)} kg CO₂</Typography>
                                <Typography>Chip Emission: {record.CEchip.toFixed(2)} kg CO₂</Typography>
                              </Box>
                              <Box sx={{ width: 200, ml: 2 }}>
                                <Pie 
                                  data={{
                                    labels: ['Electrical', 'Tool', 'Coolant', 'Material', 'Chip'],
                                    datasets: [{
                                      data: [
                                        record.CEele, 
                                        record.CEtool, 
                                        record.CEcoolant, 
                                        record.CEm, 
                                        record.CEchip
                                      ],
                                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#00FF7F']
                                    }]
                                  }}
                                  options={{ maintainAspectRatio: true }}
                                />
                              </Box>
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleClearHistory}
        >
          Clear History
        </Button>
      </Box>
    </Paper>
    </Box>
  );
};

export default History; 