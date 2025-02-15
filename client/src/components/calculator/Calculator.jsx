import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

// Add constants for coolant types, disposal methods, and chip materials
const coolantTypes = [
  'Water-Based',
  'Oil-Based',
  'Synthetic Coolant',
  'Semi-Synthetic',
  'Vegetable-Based'
];

const disposalMethods = [
  'Recycle',
  'Incineration',
  'Landfill'
];

const chipMaterials = [
  'Aluminum (primary production)',
  'Aluminum (recycled)',
  'Stainless Steel',
  'Steel (general)',
  'Steel (recycled)',
  'Copper (primary production)',
  'Copper (recycled)',
  'Zinc (primary production)',
  'Zinc (recycled)',
  'Lead (primary production)',
  'Lead (recycled)',
  'Glass (virgin production)',
  'Glass (recycled)',
  'Cement',
  'Concrete',
  'Brick',
  'Lime',
  'Sand',
  'Gravel',
  'Timber',
  'Plywood',
  'Medium-Density Fiberboard',
  'Polyethylene (PE)',
  'Polypropylene (PP)',
  'Polyvinyl Chloride (PVC)',
  'Polystyrene',
  'Polyethylene Terephthalate (PET)',
  'Nylon',
  'Polyurethane (rigid foam)',
  'Expanded Polystyrene (EPS)'
];

const Calculator = () => {
  const { token, user } = useAuth();
  const isIndustrialUser = user && user.role === 'industrial';
  const [activeStep, setActiveStep] = useState(0);
  const [machineTypes, setMachineTypes] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isIndustrial, setIsIndustrial] = useState(false);
  const [formData, setFormData] = useState({
    machineId: '',
    hours: '',
    toolMaterial: '',
    toolMass: '',
    runTime: '',
    coolantType: '',
    disposalMethod: '',
    chipMass: '',
    chipMaterial: '',
    pu: '',
    pi: '',
    tidle: '',
    dw: '',
    Lw: '',
    machiningAllowance: '',
    vc: '',
    f: '',
    ap: '',
    CC: '',
    AC: '',
    coolantConcentration: '',
    material: '',
  });
  const [result, setResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toolMaterials, setToolMaterials] = useState([]);
  const [emissionFactors, setEmissionFactors] = useState(null);

  // Define steps based on the calculation type 
  const steps = isIndustrial
    ? ['Select Machine Type', 'Select Machine', 'Industrial Parameters', 'Tool Details', 'Coolant Details', 'Material Details']
    : ['Select Machine Type', 'Select Machine', 'Tool Details', 'Coolant Details', 'Chip Material Details'];

  useEffect(() => {
    const fetchMachineTypes = async () => {
      try {
        const response = await axios.get('/api/machines/types'); // Ensure this matches your server route
        setMachineTypes(response.data);
      } catch (err) {
        setError('Failed to fetch machine types');
      }
    };
    fetchMachineTypes();
  }, [token]);

  useEffect(() => {
    const fetchToolMaterials = async () => {
      try {
        const response = await axios.get('/api/machines/tool-materials');
        setToolMaterials(response.data);
      } catch (error) {
        console.error('Error fetching tool materials:', error);
      }
    };

    fetchToolMaterials();
  }, []);

  useEffect(() => {
    const fetchEmissionFactors = async () => {
      try {
        const response = await axios.get('/api/machine/emission-factors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmissionFactors(response.data);
      } catch (err) {
        console.error('Failed to fetch emission factors:', err);
      }
    };

    fetchEmissionFactors();
  }, [token]);

  useEffect(() => {
    if (!isIndustrialUser) {
      setIsIndustrial(false);
    }
  }, [isIndustrialUser]);

  const handleTypeChange = async (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setLoading(true);
    try {
      const response = await axios.get(`/api/machines?type=${type}`);
      console.log('Machines fetched:', response.data); // Log the fetched machines
      setMachines(response.data);
    } catch (err) {
      setError('Failed to fetch machines');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isIndustrial) {
        // POST to the industrial route with industrial parameters
        response = await axios.post('/api/calculations/calculate-industrial', {
          machineId: formData.machineId,
          pu: formData.pu,
          pi: formData.pi,
          tidle: formData.tidle,
          dw: formData.dw,
          Lw: formData.Lw,
          machiningAllowance: formData.machiningAllowance,
          vc: formData.vc,
          f: formData.f,
          ap: formData.ap,
          coolantType: formData.coolantType,
          CC: formData.CC,
          AC: formData.AC,
          coolantConcentration: formData.coolantConcentration,
          toolMaterial: formData.toolMaterial,
          toolMass: formData.toolMass,
          material: formData.material,
          runTime: formData.runTime,
          chipMass: formData.chipMass
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        // Regular calculation (existing payload)
        response = await axios.post('/api/calculations/calculate', {
          machineId: formData.machineId,
          hours: formData.hours,
          toolMaterial: formData.toolMaterial,
          toolMass: formData.toolMass,
          runTime: formData.runTime,
          coolantType: formData.coolantType,
          disposalMethod: formData.disposalMethod,
          chipMass: formData.chipMass,
          material: formData.chipMaterial // For regular users, chip material is used
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setResult(response.data);
      setActiveStep(steps.length);
    } catch (error) {
      if (error.response?.data?.errors) {
        // Use the validation errors returned by the server 
        setFieldErrors(error.response.data.errors);
      } else {
        setError(error.response?.data?.error || 'Calculation failed');
      }
    }
    setLoading(false);
  };

  const getStepContent = (step) => {
    if (isIndustrial) {
      switch (step) {
        case 0:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Machine Type"
                  value={selectedType}
                  onChange={handleTypeChange}
                  required
                >
                  {machineTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          );
        case 1:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Machine"
                  name="machineId"
                  value={formData.machineId}
                  onChange={handleChange}
                  required
                >
                  {machines.map((machine) => (
                    <MenuItem key={machine._id} value={machine._id}>
                      {machine.manufacturer} - {machine.type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          );
        case 2:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Standby Power (Pu)"
                  name="pu"
                  type="number"
                  value={formData.pu}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Operational Power (Pi)"
                  name="pi"
                  type="number"
                  value={formData.pi}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Idle Time (sec)"
                  name="tidle"
                  type="number"
                  value={formData.tidle}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Workpiece Diameter (dw)"
                  name="dw"
                  type="number"
                  value={formData.dw}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Workpiece Length (Lw)"
                  name="Lw"
                  type="number"
                  value={formData.Lw}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Machining Allowance (Δ)"
                  name="machiningAllowance"
                  type="number"
                  value={formData.machiningAllowance}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Cutting Velocity (vc)"
                  name="vc"
                  type="number"
                  value={formData.vc}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Feed Rate (f)"
                  name="f"
                  type="number"
                  value={formData.f}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Depth of Cut (ap)"
                  name="ap"
                  type="number"
                  value={formData.ap}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          );
        case 3:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Tool Material"
                  name="toolMaterial"
                  value={formData.toolMaterial}
                  onChange={handleChange}
                  required
                >
                  {toolMaterials.map((material) => (
                    <MenuItem key={material} value={material}>
                      {material}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tool Mass (kg)"
                  name="toolMass"
                  type="number"
                  value={formData.toolMass}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Run Time (hours)"
                  name="runTime"
                  type="number"
                  value={formData.runTime || ''}
                  onChange={handleChange}
                  required
                  margin="normal"
                  error={!!fieldErrors?.runTime}
                  helperText={fieldErrors?.runTime || ""}
                />
              </Grid>
            </Grid>
          );
        case 4:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Coolant Type"
                  name="coolantType"
                  value={formData.coolantType}
                  onChange={handleChange}
                  required
                >
                  {coolantTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Initial Cutting Fluid Volume (CC)"
                  name="CC"
                  type="number"
                  value={formData.CC}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Additional Cutting Fluid Volume (AC)"
                  name="AC"
                  type="number"
                  value={formData.AC}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Coolant Concentration (δ)"
                  name="coolantConcentration"
                  type="number"
                  value={formData.coolantConcentration}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          );
        case 5:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  required
                >
                  {chipMaterials.map((mat) => (
                    <MenuItem key={mat} value={mat}>
                      {mat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chip Mass (kg)"
                  name="chipMass"
                  type="number"
                  value={formData.chipMass || ''}
                  onChange={handleChange}
                  required
                  margin="normal"
                  error={!!fieldErrors?.chipMass}
                  helperText={fieldErrors?.chipMass || ""}
                />
              </Grid>
            </Grid>
          );
        default:
          return 'Unknown step';
      }
    } else {
      switch (step) {
        case 0:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Machine Type"
                  value={selectedType}
                  onChange={handleTypeChange}
                  required
                >
                  {machineTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          );
        case 1:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Machine"
                  name="machineId"
                  value={formData.machineId}
                  onChange={handleChange}
                  required
                >
                  {machines.map((machine) => (
                    <MenuItem key={machine._id} value={machine._id}>
                      {machine.manufacturer} - {machine.type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          );
        case 2:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Tool Material"
                  name="toolMaterial"
                  value={formData.toolMaterial}
                  onChange={handleChange}
                  required
                >
                  {toolMaterials.map((material) => (
                    <MenuItem key={material} value={material}>
                      {material}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tool Mass (kg)"
                  name="toolMass"
                  type="number"
                  value={formData.toolMass}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Run Time (seconds)"
                  name="runTime"
                  type="number"
                  value={formData.runTime}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Operating Hours"
                  name="hours"
                  type="number"
                  value={formData.hours}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          );
        case 3:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Coolant Type"
                  name="coolantType"
                  value={formData.coolantType}
                  onChange={handleChange}
                  required
                >
                  {coolantTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Disposal Method"
                  name="disposalMethod"
                  value={formData.disposalMethod}
                  onChange={handleChange}
                  required
                >
                  {disposalMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          );
        case 4:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Chip Material"
                  name="chipMaterial"
                  value={formData.chipMaterial}
                  onChange={handleChange}
                  required
                >
                  {chipMaterials.map((material) => (
                    <MenuItem key={material} value={material}>
                      {material}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chip Mass (kg)"
                  name="chipMass"
                  type="number"
                  value={formData.chipMass}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
          );
        default:
          return 'Unknown step';
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Emissions Calculator
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      { isIndustrialUser ? (
        <Box sx={{ mb: 3 }}>
          <FormLabel component="legend">Calculation Type</FormLabel>
          <RadioGroup
            row
            value={isIndustrial ? 'industrial' : 'regular'}
            onChange={e => setIsIndustrial(e.target.value === 'industrial')}
          >
            <FormControlLabel value="regular" control={<Radio />} label="Regular" />
            <FormControlLabel value="industrial" control={<Radio />} label="Industrial" />
          </RadioGroup>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <FormLabel component="legend">Calculation Type</FormLabel>
          <Typography>Regular Calculation</Typography>
        </Box>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        {activeStep === steps.length ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Calculation Results
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Emissions Breakdown
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography>Electrical Emission: {result.CEele.toFixed(2)} kg CO₂</Typography>
                    <Typography>Tool Emission: {result.CEtool.toFixed(2)} kg CO₂</Typography>
                    <Typography>Coolant Emission: {result.CEcoolant.toFixed(2)} kg CO₂</Typography>
                    <Typography>Material Emission: {result.CEm.toFixed(2)} kg CO₂</Typography>
                    <Typography>Chip Emission: {result.CEchip.toFixed(2)} kg CO₂</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">
                      Total Emission: {result.total.toFixed(2)} kg CO₂
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button onClick={() => {
                setActiveStep(0);
                setResult(null);
              }}>
                Calculate Another
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            {getStepContent(activeStep)}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : activeStep === steps.length - 1 ? 'Calculate' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
      </form>

      {emissionFactors && (
        <Typography variant="h6">Emission Factors Loaded</Typography>
      )}
    </Paper>
  );
};

export default Calculator; 