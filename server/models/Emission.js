const mongoose = require('mongoose');

const emissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    machineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
        required: true
    },
    // Electrical Emission
    CEele: {
        type: Number,
        required: true
    },
    // Tool Emission
    CEtool: {
        type: Number,
        required: true
    },
    // Coolant Emission
    CEcoolant: {
        type: Number,
        required: true
    },
    // Material Emission
    CEm: {
        type: Number,
        required: true
    },
    // Chip Emission
    CEchip: {
        type: Number,
        required: true
    },
    // Total Emission
    totalEmission: {
        type: Number,
        required: true
    },
    // Input Parameters
    parameters: {
        runTime: {
            type: Number,
            required: true
        },
        toolMaterial: {
            type: String,
            required: true
        },
        toolMass: {
            type: Number,
            required: true
        },
        coolantType: {
            type: String,
            required: true
        },
        workpieceMaterial: {
            type: String,
            required: true
        },
        chipMass: {
            type: Number,
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: undefined
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Emission = mongoose.model('Emission', emissionSchema);

module.exports = Emission; 