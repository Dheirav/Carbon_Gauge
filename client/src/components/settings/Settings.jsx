import React, { useEffect, useState } from 'react';
import { Paper, Typography, TextField, Button, Alert, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Settings = () => {
  const { token } = useAuth();
  const [complianceThreshold, setComplianceThreshold] = useState(10);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assume the API returns an object with a property `complianceThreshold`
        setComplianceThreshold(response.data.complianceThreshold || 10);
      } catch (err) {
        // If settings are not found, use default value (10)
        if (err.response && err.response.status === 404) {
          setComplianceThreshold(10);
        } else {
          setError('Failed to load settings.');
        }
      }
    };

    fetchSettings();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update the user settings including the compliance threshold
      await axios.patch(
        '/api/settings',
        { complianceThreshold },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Settings updated successfully.');
      setError('');
    } catch (err) {
      setError('Failed to update settings.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Compliance Threshold (kg CO₂)"
          type="number"
          value={complianceThreshold}
          onChange={(e) => setComplianceThreshold(parseFloat(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default Settings; 