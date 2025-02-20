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
  const [industrialFormData, setIndustrialFormData] = useState({
    machineId: '',
    pu: '',
    pi: '',
    tidle: '',
    dw: '',
    Lw: '',
    machiningAllowance: '',
    vc: '',
    f: '',
    ap: '',
    coolantType: '',
    CC: '',
    AC: '',
    coolantConcentration: '',
    toolMaterial: '',
    toolMass: '',
    material: '',
    chipMass: '',
  });
  const [regularFormData, setRegularFormData] = useState({
    machineId: '',
    machineType: '',
    manufacturer: '',
    hours: '',
    toolMaterial: '',
    toolMass: '',
    runTime: '',
    coolantType: '',
    disposalMethod: '',
    chipMass: '',
    material: '',
    workpieceMaterial: '',
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
    console.log('Selected machine type:', type); // Debug log
    setSelectedType(type);
    setRegularFormData({ ...regularFormData, machineType: type });
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
    if (isIndustrial) {
        setIndustrialFormData({ ...industrialFormData, [name]: value });
    } else {
        setRegularFormData({ ...regularFormData, [name]: value });
    }
  };
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting with data:', regularFormData); // Debug log
    setLoading(true);
    try {
        let response;
        if (isIndustrial) {
            response = await axios.post('/api/calculations/calculate-industrial', {
                machineId: industrialFormData.machineId,
                pu: industrialFormData.pu,
                pi: industrialFormData.pi,
                tidle: industrialFormData.tidle,
                dw: industrialFormData.dw,
                Lw: industrialFormData.Lw,
                machiningAllowance: industrialFormData.machiningAllowance,
                vc: industrialFormData.vc,
                f: industrialFormData.f,
                ap: industrialFormData.ap,
                coolantType: industrialFormData.coolantType,
                CC: industrialFormData.CC,
                AC: industrialFormData.AC,
                coolantConcentration: industrialFormData.coolantConcentration,
                toolMaterial: industrialFormData.toolMaterial,
                toolMass: industrialFormData.toolMass,
                material: industrialFormData.material,
                chipMass: industrialFormData.chipMass
            }, { headers: { Authorization: `Bearer ${token}` } });
        } else {
            const selectedMachine = machines.find(machine => machine._id === regularFormData.machineId);
            response = await axios.post('/api/calculations/calculate', {
                machineId: regularFormData.machineId,
                machineType: regularFormData.machineType,
                brand: selectedMachine ? selectedMachine.manufacturer : '',
                toolMaterial: regularFormData.toolMaterial,
                toolMass: regularFormData.toolMass,
                runTime: regularFormData.runTime,
                coolantType: regularFormData.coolantType,
                disposalMethod: regularFormData.disposalMethod,
                chipMass: regularFormData.chipMass,
                material: regularFormData.material,
            }, { headers: { Authorization: `Bearer ${token}` } });
        }
        setResult(response.data);
        setActiveStep(steps.length);
    } catch (error) {
        console.error('Error during calculation:', error);
        setError(error.response?.data?.error || 'Calculation failed');
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
                  value={industrialFormData.machineId}
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
                  label="Standby Power (kW)"
                  name="pu"
                  type="number"
                  value={industrialFormData.pu}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Power Consumption (kW)"
                  name="pi"
                  type="number"
                  value={industrialFormData.pi}
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
                  value={industrialFormData.tidle}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Workpiece Diameter (mm)"
                  name="dw"
                  type="number"
                  value={industrialFormData.dw}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Workpiece Length (mm)"
                  name="Lw"
                  type="number"
                  value={industrialFormData.Lw}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Machining Allowance (mm)"
                  name="machiningAllowance"
                  type="number"
                  value={industrialFormData.machiningAllowance}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Cutting Velocity (m/s)"
                  name="vc"
                  type="number"
                  value={industrialFormData.vc}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Feed Rate (mm/r)"
                  name="f"
                  type="number"
                  value={industrialFormData.f}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Depth of Cut (mm)"
                  name="ap"
                  type="number"
                  value={industrialFormData.ap}
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
                  value={industrialFormData.toolMaterial}
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
                  value={industrialFormData.toolMass}
                  onChange={handleChange}
                  required
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
                  value={industrialFormData.coolantType}
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
                  label="Initial Cutting Fluid Volume (l)"
                  name="CC"
                  type="number"
                  value={industrialFormData.CC}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Additional Cutting Fluid Volume (l)"
                  name="AC"
                  type="number"
                  value={industrialFormData.AC}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Coolant Concentration (%)"
                  name="coolantConcentration"
                  type="number"
                  value={industrialFormData.coolantConcentration}
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
                  value={industrialFormData.material}
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
                  value={regularFormData.machineType}
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
                  value={regularFormData.machineId}
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
                  value={regularFormData.toolMaterial}
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
                  value={regularFormData.toolMass}
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
                  value={regularFormData.runTime}
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
                  value={regularFormData.coolantType}
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
                  value={regularFormData.disposalMethod}
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
                  label="Material"
                  name="material"
                  value={regularFormData.material}
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
                  label=" Mass (kg)"
                  name="chipMass"
                  type="number"
                  value={regularFormData.chipMass}
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
    <Paper sx={{ p: 3, maxHeight: '80vh', overflowY: 'auto' }}>
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
                    <Typography>Electrical Emission: {result.CEelec.toFixed(2)} kg CO₂</Typography>
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
    </Paper>
  );
};

export default Calculator; 