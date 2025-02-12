const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');

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
router.get('/emission-factors', (req, res) => {
    const emissionFactors = {
        materials: {
            'Aluminum (primary production)': 11.89,
            'Aluminum (recycled)': 2.01,
            'Stainless Steel': 6.15,
            'Steel (general)': 1.77,
            'Steel (recycled)': 0.88,
            'Copper (primary production)': 3.83,
            'Copper (recycled)': 2.77,
            'Zinc (primary production)': 3.86,
            'Zinc (recycled)': 0.48,
            'Lead (primary production)': 2.61,
            'Lead (recycled)': 0.53,
            'Glass (virgin production)': 4.4,
            'Glass (recycled)': 0.73,
            'Cement': 0.89,
            'Concrete': 0.15,
            'Brick': 0.24,
            'Lime': 0.74,
            'Sand': 0.01,
            'Gravel': 0.0048,
            'Timber': 0.46,
            'Plywood': 1.07,
            'Medium-Density Fiberboard': 0.72,
            'Polyethylene (PE)': 2.4,
            'Polypropylene (PP)': 1.95,
            'Polyvinyl Chloride (PVC)': 2.22,
            'Polystyrene': 3.07,
            'Polyethylene Terephthalate (PET)': 5.44,
            'Nylon': 7.9,
            'Polyurethane (rigid foam)': 3.61,
            'Expanded Polystyrene (EPS)': 2.55,
        },
        chips: {
            'Aluminum (primary production)': 1.23,
            'Aluminum (recycled)': 0.56,
            'Stainless Steel': 0.77,
            'Steel (general)': 0.5,
            'Steel (recycled)': 0.3,
            'Copper (primary production)': 0.6,
            'Copper (recycled)': 0.32,
            'Zinc (primary production)': 0.53,
            'Zinc (recycled)': 0.23,
            'Lead (primary production)': 0.42,
            'Lead (recycled)': 0.21,
            'Glass (virgin production)': 0.6,
            'Glass (recycled)': 0.27,
            'Cement': 0.3,
            'Concrete': 0.159,
            'Brick': 0.24,
            'Lime': 0.21,
            'Sand': 0.0001,
            'Gravel': 0,
            'Timber': 0,
            'Plywood': 0.09,
            'Medium-Density Fiberboard': 0.3,
            'Polyethylene (PE)': 0.7,
            'Polypropylene (PP)': 0.5,
            'Polyvinyl Chloride (PVC)': 0.432,
            'Polystyrene': 0.55,
            'Polyethylene Terephthalate (PET)': 0.44,
            'Nylon': 0.23,
            'Polyurethane (rigid foam)': 0.81,
            'Expanded Polystyrene (EPS)': 0.33,
        }
    };
    res.json(emissionFactors);
});

module.exports = router; 