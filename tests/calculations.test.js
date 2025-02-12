const request = require('supertest');
const app = require('../server'); // Adjust the path to your Express app
const mongoose = require('mongoose');
const User = require('../server/models/User');

describe('Calculations API', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Create a test user and get a token
        const user = await User.create({ name: 'Test User', email: 'test@example.com', password: 'password' });
        userId = user._id;
        token = 'Bearer ' + user.generateAuthToken(); // Assuming you have a method to generate a token
    });

    afterAll(async () => {
        // Clean up the database
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    it('should generate a report for calculations', async () => {
        const response = await request(app)
            .post('/api/calculations/calculate')
            .set('Authorization', token)
            .send({
                machineId: 'someMachineId',
                hours: 10,
                toolMaterial: 'HSS',
                toolMass: 5,
                runTime: 10,
                coolantType: 'Mineral',
                disposalMethod: 'Recycle',
                material: 'steel',
                chipMass: 2,
            })
            .expect(200);

        expect(response.body).toHaveProperty('totalEmission');
        expect(response.body.totalEmission).toBeGreaterThan(0);
    });

    const combinations = [
        { toolMaterial: 'HSS', coolantType: 'Mineral', disposalMethod: 'Recycle' },
        { toolMaterial: 'Carbide', coolantType: 'Synthetic', disposalMethod: 'Incineration' },
        // Add more combinations as needed
    ];

    combinations.forEach((combo) => {
        it(`should calculate emissions for ${combo.toolMaterial} with ${combo.coolantType}`, async () => {
            const response = await request(app)
                .post('/api/calculations/calculate')
                .set('Authorization', token)
                .send({
                    machineId: 'someMachineId',
                    hours: 10,
                    toolMaterial: combo.toolMaterial,
                    toolMass: 5,
                    runTime: 10,
                    coolantType: combo.coolantType,
                    disposalMethod: combo.disposalMethod,
                    material: 'steel',
                    chipMass: 2,
                })
                .expect(200);

            expect(response.body).toHaveProperty('totalEmission');
            expect(response.body.totalEmission).toBeGreaterThan(0);
        });
    });
}); 