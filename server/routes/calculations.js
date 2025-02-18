const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Machine = require('../models/Machine');
const Emission = require('../models/Emission');
const CalculationService = require('../services/calculation.service');

// Get all machines
router.get('/machines', auth, async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Calculate emissions
router.post('/calculate', auth, async (req, res) => {
    console.log('Received calculation request:', req.body); // Debug log
    try {
        const result = await CalculationService.calculateRegularTotalEmission(req.body);
        // Save calculation results to the database
        const emission = new Emission({
            userId: req.user._id,
            machineId: req.body.machineId,
            machineType: req.body.machineType,
            brand: req.body.manufacturer,
            CEele: result.CEelec,
            CEtool: result.CEtool,
            CEcoolant: result.CEcoolant,
            CEm: result.CEm,
            CEchip: result.CEchip,
            totalEmission: result.total,
            parameters: req.body // Save all parameters for reference
        });
        await emission.save();
        res.json(result);
    } catch (error) {
        console.error('Calculation error:', error);
        res.status(500).send({ error: error.message });
    }
});

// Get user's calculation history
router.get('/history', auth, async (req, res) => {
    try {
        const emissions = await Emission.find({ userId: req.user._id })
            .populate('machineId')
            .sort({ createdAt: -1 });
        res.json(emissions);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Clear user's calculation history
router.delete('/history', auth, async (req, res) => {
    try {
        await Emission.deleteMany({ userId: req.user._id }); // Delete all emissions for the user
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).send({ error: error.message });
    }
});

// New route for Industrial Emission Calculation
router.post('/calculate-industrial', auth, async (req, res) => {
    try {
        const result = await CalculationService.calculateIndustrialTotalEmission(req.body);
        console.log('Industrial calculation result:', result); // Log the result before saving
        const emission = new Emission({
            userId: req.user._id,
            machineId: req.body.machineId,
            machineType: req.body.machineType,
            brand: req.body.manufacturer,
            CEele: result.CEelec,
            CEtool: result.CEtool,
            CEcoolant: result.CEcoolant,
            CEm: result.CEm,
            CEchip: result.CEchip,
            totalEmission: result.total,
            parameters: req.body
        });
        await emission.save();
        res.status(200).send(result);
    } catch (error) {
        console.error('Error saving industrial emission:', error);
        res.status(500).send({ error: error.message });
    }
});

// Route for fetching emission factors
router.get('/emission-factors', auth, async (req, res) => {
    try {
        const factors = await getEmissionFactors(); // Implement this function to fetch factors
        res.status(200).send(factors);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch emission factors' });
    }
});

module.exports = router; 