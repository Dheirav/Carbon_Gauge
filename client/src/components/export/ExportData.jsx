import React, { useState } from 'react';
import { Box, Button, Typography, Alert, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ExportData = () => {
  const { token } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // State variable to store the selected export type.
  const [exportType, setExportType] = useState('CSV');

  // Helper function to convert JSON data to CSV.
  // This version flattens nested objects via JSON-stringifying.
  const exportToCSV = (data) => {
    if (!data || data.length === 0) {
      return '';
    }
    const headers = Object.keys(data[0]);
    const csvRows = [];
    // Header row.
    csvRows.push(headers.join(','));
    // Data rows.
    for (const row of data) {
      const values = headers.map(header => {
        let cell = row[header];
        if (cell !== null && typeof cell === 'object') {
          cell = JSON.stringify(cell);
        }
        // Escape quotes by replacing with double quotes.
        const escaped = String(cell).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  };

  // Helper function to convert JSON data to XML.
  const exportToXML = (data) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<records>\n';
    data.forEach(record => {
      xml += '  <record>\n';
      for (const key in record) {
        let value = record[key];
        if (value !== null && typeof value === 'object') {
          value = JSON.stringify(value);
        }
        xml += `    <${key}>${value}</${key}>\n`;
      }
      xml += '  </record>\n';
    });
    xml += '</records>';
    return xml;
  };

  const handleExport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/calculations/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      if (!data || data.length === 0) {
        setError('No data available to export.');
        setLoading(false);
        return;
      }
      let content = '';
      let mimeType = '';
      let fileExtension = '';
      if (exportType === 'CSV') {
        content = exportToCSV(data);
        mimeType = 'text/csv';
        fileExtension = 'csv';
      } else if (exportType === 'JSON') {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        fileExtension = 'json';
      } else if (exportType === 'XML') {
        content = exportToXML(data);
        mimeType = 'application/xml';
        fileExtension = 'xml';
      }
      // Create a Blob from the exported content and trigger download.
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `exported_data.${fileExtension}`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Export Data
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="export-type-label">Export Format</InputLabel>
          <Select
            labelId="export-type-label"
            id="export-type"
            value={exportType}
            label="Export Format"
            onChange={(e) => setExportType(e.target.value)}
          >
            <MenuItem value="CSV">CSV</MenuItem>
            <MenuItem value="JSON">JSON</MenuItem>
            <MenuItem value="XML">XML</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleExport} 
            disabled={loading}
          >
            {loading ? 'Exporting...' : `Export Data as ${exportType}`}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ExportData; 