import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  MenuItem
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'regular',
    company: ''
  });
  const [error, setError] = useState('');
  // New state for field-specific errors
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    // Clear any error for this field as the user corrects it
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Additional validation for industrial account: Company field must not be empty
    if (formData.role === 'industrial' && !formData.company.trim()) {
      setError('Company is required for Industrial User registration');
      return;
    }
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      // Clear previous field errors
      setFieldErrors({});
      if (err.response) {
        if (err.response.data && err.response.data.errors) {
          // Extract the field-specific errors
          setFieldErrors(err.response.data.errors);
          // Combine error messages from each field into one detailed message
          const errorMessages = Object.entries(err.response.data.errors)
            .map(([field, msg]) => `${field[0].toUpperCase() + field.slice(1)}: ${msg}`)
            .join(' | ');
          setError("Registration failed: " + errorMessages);
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.status === 400) {
          setError("Registration failed: Please check your email, password, and if applicable, your company information.");
        } else {
          setError("Registration failed: " + err.response.statusText);
        }
      } else if (err.message) {
        setError("Registration failed: " + err.message);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Register
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
            />
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
              required
              error={!!fieldErrors.role}
              helperText={fieldErrors.role}
            >
              <MenuItem value="regular">Regular User</MenuItem>
              <MenuItem value="industrial">Industrial User</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              margin="normal"
              required={formData.role === 'industrial'}
              error={!!fieldErrors.company}
              helperText={
                formData.role === 'industrial'
                  ? (fieldErrors.company || 'Company is required for Industrial User.')
                  : fieldErrors.company
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Register
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="/login">Already have an account? Login</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 