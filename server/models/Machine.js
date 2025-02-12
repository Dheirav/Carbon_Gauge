const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['CNC', 'VMC', 'HMC', 'Grinding', 'Milling', '3D Printer', 'Hydraulic', 'Pneumatic', 
               'Drilling', 'Forging', 'Injection', 'Threading', 'Laser', 'EDM', 'Extrusion', 'Hydraulic Press']
    },
    manufacturer: {
        type: String,
        required: true
    },
    powerConsumption: {
        type: Number,
        required: true
    },
    carbonIntensity: {
        type: Number,
        default: 0.475 // kg CO₂/kWh
    },
    emissionFactor: {
        type: Number,
        required: true
    }
});

const Machine = mongoose.model('Machine', machineSchema);

module.exports = Machine; 