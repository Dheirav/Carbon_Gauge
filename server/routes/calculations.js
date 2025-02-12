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
    try {
        const {
            machineId,
            hours,
            toolMaterial,
            toolMass,
            runTime,
            coolantType,
            disposalMethod,
            material,
            chipMass,
            location
        } = req.body;

        const machine = await Machine.findById(machineId);
        if (!machine) {
            return res.status(404).send({ error: 'Machine not found' });
        }

        const result = await CalculationService.calculateTotalEmission({
            machineType: machine.type,
            brand: machine.manufacturer,
            hours,
            toolMaterial,
            toolMass,
            runTime,
            coolantType,
            disposalMethod,
            material,
            chipMass
        });

        // Save calculation results
        const emission = new Emission({
            userId: req.user._id,
            machineId,
            CEele: result.CEele,
            CEtool: result.CEtool,
            CEcoolant: result.CEcoolant,
            CEm: result.CEm,
            CEchip: result.CEchip,
            totalEmission: result.total,
            parameters: {
                runTime,
                toolMaterial,
                toolMass,
                coolantType,
                workpieceMaterial: material,
                chipMass,
                location: location ? {
                    type: 'Point',
                    coordinates: [location.longitude, location.latitude]
                } : undefined
            }
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

module.exports = router; 