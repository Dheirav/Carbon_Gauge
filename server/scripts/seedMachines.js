const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Machine = require('../models/Machine');

dotenv.config();

const machines = [
    // CNC Machines
    { type: 'CNC', manufacturer: 'Mazak', powerConsumption: 10, carbonIntensity: 0.475, emissionFactor: 4.75 },
    { type: 'CNC', manufacturer: 'DMG Mori', powerConsumption: 12, carbonIntensity: 0.475, emissionFactor: 5.7 },
    { type: 'CNC', manufacturer: 'Haas Automation', powerConsumption: 8, carbonIntensity: 0.475, emissionFactor: 3.8 },
    { type: 'CNC', manufacturer: 'Okuma Corporation', powerConsumption: 15, carbonIntensity: 0.475, emissionFactor: 7.13 },
    { type: 'CNC', manufacturer: 'Hurco Companies, Inc.', powerConsumption: 9, carbonIntensity: 0.475, emissionFactor: 4.28 },
    { type: 'CNC', manufacturer: 'Makino', powerConsumption: 12, carbonIntensity: 0.475, emissionFactor: 5.7 },
    { type: 'CNC', manufacturer: 'Fanuc Corporation', powerConsumption: 6, carbonIntensity: 0.475, emissionFactor: 2.85 },
    { type: 'CNC', manufacturer: 'Doosan Machine Tools', powerConsumption: 10, carbonIntensity: 0.475, emissionFactor: 4.75 },
    { type: 'CNC', manufacturer: 'Matsuura Machinery', powerConsumption: 14, carbonIntensity: 0.475, emissionFactor: 6.65 },
    { type: 'CNC', manufacturer: 'Brother Industries', powerConsumption: 5, carbonIntensity: 0.475, emissionFactor: 2.38 },

    // VMC Machines
    { type: 'VMC', manufacturer: 'Mazak', powerConsumption: 12, carbonIntensity: 0.475, emissionFactor: 5.7 },
    { type: 'VMC', manufacturer: 'DMG Mori', powerConsumption: 15, carbonIntensity: 0.475, emissionFactor: 7.13 },
    { type: 'VMC', manufacturer: 'Haas Automation', powerConsumption: 10, carbonIntensity: 0.475, emissionFactor: 4.75 },
    { type: 'VMC', manufacturer: 'Okuma Corporation', powerConsumption: 14, carbonIntensity: 0.475, emissionFactor: 6.65 },
    { type: 'VMC', manufacturer: 'Makino', powerConsumption: 18, carbonIntensity: 0.475, emissionFactor: 8.55 },
    { type: 'VMC', manufacturer: 'Fanuc Corporation', powerConsumption: 8, carbonIntensity: 0.475, emissionFactor: 3.8 },
    { type: 'VMC', manufacturer: 'Doosan Machine Tools', powerConsumption: 12, carbonIntensity: 0.475, emissionFactor: 5.7 },
    { type: 'VMC', manufacturer: 'Matsuura Machinery', powerConsumption: 16, carbonIntensity: 0.475, emissionFactor: 7.6 },
    { type: 'VMC', manufacturer: 'Brother Industries', powerConsumption: 6, carbonIntensity: 0.475, emissionFactor: 2.85 },
    { type: 'VMC', manufacturer: 'Hyundai WIA', powerConsumption: 14, carbonIntensity: 0.475, emissionFactor: 6.65 },

    // Milling Machines
    { type: 'Milling', manufacturer: 'Mazak', powerConsumption: 8, carbonIntensity: 0.475, emissionFactor: 3.8 },
    { type: 'Milling', manufacturer: 'DMG Mori', powerConsumption: 10, carbonIntensity: 0.475, emissionFactor: 4.75 },
    { type: 'Milling', manufacturer: 'Haas Automation', powerConsumption: 7, carbonIntensity: 0.475, emissionFactor: 3.33 },
    { type: 'Milling', manufacturer: 'Okuma Corporation', powerConsumption: 12, carbonIntensity: 0.475, emissionFactor: 5.7 },
    { type: 'Milling', manufacturer: 'Makino', powerConsumption: 15, carbonIntensity: 0.475, emissionFactor: 7.13 },
    { type: 'Milling', manufacturer: 'Fanuc Corporation', powerConsumption: 5, carbonIntensity: 0.475, emissionFactor: 2.38 },
    { type: 'Milling', manufacturer: 'Doosan Machine Tools', powerConsumption: 9, carbonIntensity: 0.475, emissionFactor: 4.28 },
    { type: 'Milling', manufacturer: 'Matsuura Machinery', powerConsumption: 11, carbonIntensity: 0.475, emissionFactor: 5.23 },
    { type: 'Milling', manufacturer: 'Brother Industries', powerConsumption: 6, carbonIntensity: 0.475, emissionFactor: 2.85 },
    { type: 'Milling', manufacturer: 'Hyundai WIA', powerConsumption: 10, carbonIntensity: 0.475, emissionFactor: 4.75 },

    // HMC Machines
    { type: 'HMC', manufacturer: 'Mazak', powerConsumption: 15, carbonIntensity: 0.475, emissionFactor: 7.13 },
    { type: 'HMC', manufacturer: 'DMG Mori', powerConsumption: 18, carbonIntensity: 0.475, emissionFactor: 8.55 },
    { type: 'HMC', manufacturer: 'Haas Automation', powerConsumption: 12, carbonIntensity: 0.475, emissionFactor: 5.7 },
    { type: 'HMC', manufacturer: 'Okuma Corporation', powerConsumption: 20, carbonIntensity: 0.475, emissionFactor: 9.5 },
    { type: 'HMC', manufacturer: 'Makino', powerConsumption: 22, carbonIntensity: 0.475, emissionFactor: 10.45 },
    { type: 'HMC', manufacturer: 'Fanuc Corporation', powerConsumption: 10, carbonIntensity: 0.475, emissionFactor: 4.75 },
    { type: 'HMC', manufacturer: 'Doosan Machine Tools', powerConsumption: 16, carbonIntensity: 0.475, emissionFactor: 7.6 },
    { type: 'HMC', manufacturer: 'Matsuura Machinery', powerConsumption: 18, carbonIntensity: 0.475, emissionFactor: 8.55 },
    { type: 'HMC', manufacturer: 'Brother Industries', powerConsumption: 8, carbonIntensity: 0.475, emissionFactor: 3.8 },
    { type: 'HMC', manufacturer: 'Hyundai WIA', powerConsumption: 16, carbonIntensity: 0.475, emissionFactor: 7.6 },
    
    // Grinding Machines
    { type: 'Grinding', manufacturer: 'Mazak', powerConsumption: 6, carbonIntensity: 0.475, emissionFactor: 2.85 },
    { type: 'Grinding', manufacturer: 'DMG Mori', powerConsumption: 8, carbonIntensity: 0.475, emissionFactor: 3.8 },
    { type: 'Grinding', manufacturer: 'Haas Automation', powerConsumption: 5, carbonIntensity: 0.475, emissionFactor: 2.38 },
    { type: 'Grinding', manufacturer: 'Okuma Corporation', powerConsumption: 7, carbonIntensity: 0.475, emissionFactor: 3.33 },
    { type: 'Grinding', manufacturer: 'Makino', powerConsumption: 9, carbonIntensity: 0.475, emissionFactor: 4.28 },
    { type: 'Grinding', manufacturer: 'Fanuc Corporation', powerConsumption: 4, carbonIntensity: 0.475, emissionFactor: 1.9 },
    { type: 'Grinding', manufacturer: 'Doosan Machine Tools', powerConsumption: 6, carbonIntensity: 0.475, emissionFactor: 2.85 },
    { type: 'Grinding', manufacturer: 'Matsuura Machinery', powerConsumption: 8, carbonIntensity: 0.475, emissionFactor: 3.8 },
    { type: 'Grinding', manufacturer: 'Brother Industries', powerConsumption: 5, carbonIntensity: 0.475, emissionFactor: 2.38 },
    { type: 'Grinding', manufacturer: 'Hyundai WIA', powerConsumption: 7, carbonIntensity: 0.475, emissionFactor: 3.33 },

    // Hydraulic Presses
    { type: 'Hydraulic Press', manufacturer: 'Enerpac', powerConsumption: 20, carbonIntensity: 0.475, emissionFactor: 9.5 },
    { type: 'Hydraulic Press', manufacturer: 'Dake', powerConsumption: 18, carbonIntensity: 0.475, emissionFactor: 8.55 },
    { type: 'Hydraulic Press', manufacturer: 'Baileigh Industrial', powerConsumption: 22, carbonIntensity: 0.475, emissionFactor: 10.45 },
    { type: 'Hydraulic Press', manufacturer: 'H-Frame', powerConsumption: 25, carbonIntensity: 0.475, emissionFactor: 11.88 },
    { type: 'Hydraulic Press', manufacturer: 'Phoenix Hydraulic Presses', powerConsumption: 24, carbonIntensity: 0.475, emissionFactor: 11.4 },
    { type: 'Hydraulic Press', manufacturer: 'Betenbender', powerConsumption: 23, carbonIntensity: 0.475, emissionFactor: 10.93 },
    { type: 'Hydraulic Press', manufacturer: 'Beckwood', powerConsumption: 21, carbonIntensity: 0.475, emissionFactor: 9.98 },
    { type: 'Hydraulic Press', manufacturer: 'Greenerd', powerConsumption: 26, carbonIntensity: 0.475, emissionFactor: 12.35 },
    { type: 'Hydraulic Press', manufacturer: 'Multipress', powerConsumption: 19, carbonIntensity: 0.475, emissionFactor: 9.03 },
    { type: 'Hydraulic Press', manufacturer: 'Williams White', powerConsumption: 27, carbonIntensity: 0.475, emissionFactor: 12.83 }
];

const seedMachines = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing machines
        await Machine.deleteMany({});
        console.log('Cleared existing machines');

        // Insert new machines
        await Machine.insertMany(machines);
        console.log('Machines seeded successfully!');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedMachines(); 