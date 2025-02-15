import React, { useEffect, useState } from 'react';
import { Typography, Paper, Box, Alert, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Analytics = () => {
    const { token } = useAuth();
    const [emissionData, setEmissionData] = useState([]);
    const [error, setError] = useState('');
    const [complianceThreshold, setComplianceThreshold] = useState(10);
    // A flag to indicate that the chart components are registered.
    const [isChartReady, setIsChartReady] = useState(false);

    // Register Chart.js components (including line and point elements) inside a useEffect hook.
    useEffect(() => {
        ChartJS.register(
            CategoryScale, 
            LinearScale, 
            BarElement, 
            Title, 
            Tooltip, 
            Legend, 
            ArcElement,
            LineElement,
            PointElement
        );
        setIsChartReady(true);
    }, []);

    // Fetch historical emission data.
    useEffect(() => {
        const fetchEmissionData = async () => {
            try {
                const response = await axios.get('/api/calculations/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Fetched emission data:', response.data);
                setEmissionData(response.data);
            } catch (err) {
                setError('Failed to fetch emission data');
                console.error(err);
            }
        };

        fetchEmissionData();
    }, [token]);

    useEffect(() => {
        // Fetch compliance threshold from settings
        const fetchComplianceThreshold = async () => {
            try {
                const response = await axios.get('/api/settings', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setComplianceThreshold(response.data.complianceThreshold || 10);
            } catch (err) {
                console.error('Failed to load compliance threshold:', err);
            }
        };

        fetchComplianceThreshold();
    }, [token]);

    // Prepare the chart data when emission data is available
    let chartData;
    if (emissionData.length > 0) {
        // Use record creation dates as labels
        const labels = emissionData.map(record =>
            new Date(record.createdAt).toLocaleDateString()
        );
        chartData = {
            labels,
            datasets: [
                {
                    label: 'Electrical Emission',
                    data: emissionData.map(record => record.CEele),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Tool Emission',
                    data: emissionData.map(record => record.CEtool),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                },
                {
                    label: 'Coolant Emission',
                    data: emissionData.map(record => record.CEcoolant),
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                },
                {
                    label: 'Material Emission',
                    data: emissionData.map(record => record.CEm),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
                {
                    label: 'Chip Emission',
                    data: emissionData.map(record => record.CEchip),
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                },
                {
                    label: 'Total Emission',
                    data: emissionData.map(record => record.totalEmission),
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                },
                {
                    label: 'Compliance Threshold (Total Emission)',
                    type: 'line',  // Render this dataset as a line
                    data: labels.map(() => complianceThreshold),
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                },
            ],
        };
    } else {
        // Dummy data for fallback – sample dates and values in the expected format
        const dummyLabels = ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01'];
        chartData = {
            labels: dummyLabels,
            datasets: [
                {
                    label: 'Electrical Emission',
                    data: [4, 5, 3, 6, 7],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Tool Emission',
                    data: [2, 3, 1, 2, 3],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                },
                {
                    label: 'Coolant Emission',
                    data: [1, 2, 2, 1, 2],
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                },
                {
                    label: 'Material Emission',
                    data: [3, 2, 4, 3, 3],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
                {
                    label: 'Chip Emission',
                    data: [1, 1, 2, 1, 1],
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                },
                {
                    label: 'Total Emission',
                    data: [11, 13, 12, 13, 15],
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                },
                {
                    label: 'Compliance Threshold (Total Emission)',
                    type: 'line',
                    data: dummyLabels.map(() => complianceThreshold),
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                },
            ],
        };
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Analytics
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Paper sx={{ mt: 2, p: 2, height: 500 }}>
                {!isChartReady ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    emissionData.length === 0 ? (
                        <Alert severity="info">No historical data available to display analytics.</Alert>
                    ) : (
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    )
                )}
            </Paper>
        </Box>
    );
};

export default Analytics; 