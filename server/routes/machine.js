const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const auth = require('../middleware/auth');

// Get all machine types
router.get('/types', async (req, res) => {
    try {
        const machineTypes = await Machine.distinct('type'); // Get unique machine types
        res.json(machineTypes);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get machines by type
router.get('/', async (req, res) => {
    const { type } = req.query; // Get the type from query parameters
    try {
        const machines = await Machine.find({ type }); // Find machines by type
        res.json(machines);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get all tool materials
router.get('/tool-materials', (req, res) => {
    const toolMaterials = [
        'High-Speed Steel (HSS)',
        'Uncoated Carbide',
        'Coated Carbide',
        'Cermet',
        'Ceramic Tools',
        'PCBN',
        'Polycrystalline Diamond (PCD)',
        'High-Performance Coated HSS',
        'Nano-Composite Tools',
        'Tungsten Carbide with Reduced Cobalt',
        'Ultra-Hard Composite Tools',
        'Sintered Diamond Tools',
        'Binderless Tungsten Carbide',
        'Electroplated Carbide Tools',
        'High Purity Ceramic Composite Tools',
        'Titanium Carbide Tools',
        'Vanadium Alloyed Carbide Tools',
        'Cobalt-Free Carbide Tools',
        'Hardfacing Coated Tools (Tungsten-Based)',
        'Gradient Coating Carbide Tools',
        'Nanostructured HSS Tools',
        'Multi-layer Coated Carbide Tools (TiCN/TiAIN)',
        'PCD with Metal Matrix Bonding',
        'PCD with Resin Bonding',
        'Diamond-like Carbon (DLC) Coated Tools (on HSS)',
        'Bulk CBN Tools',
        'Sintered cBN Tools with Binder',
        'Recycled Carbide Tools',
        'Advanced Ultra-Hard Nanocomposite Tools'
    ];
    res.json(toolMaterials);
});

// Get emission factors
router.get('/emission-factors', auth, async (req, res) => {
    try {
        const factors = {
            'CNC': 4.75,
            'VMC': 5.0,
            // Add other machine types and their factors
        };
        res.status(200).send(factors);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch emission factors' });
    }
});

module.exports = router; 