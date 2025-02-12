const request = require('supertest');
const app = require('../server'); // Adjust the path to your Express app
const mongoose = require('mongoose');
const User = require('../server/models/User');
const Emission = require('../server/models/Emission');

describe('History API', () => {
    let token;
    let userId;

    beforeAll(async () => {
        // Connect to the database
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Clear existing users and emissions
        await User.deleteMany({});
        await Emission.deleteMany({});

        // Create a test user and get a token
        const user = await User.create({ name: 'Test User', email: 'test@example.com', password: 'password' });
        userId = user._id;
        token = 'Bearer ' + user.generateAuthToken(); // Assuming you have a method to generate a token
    });

    afterAll(async () => {
        // Clean up the database
        await User.deleteMany({});
        await Emission.deleteMany({});
        await mongoose.connection.close();
    });

    it('should retrieve user history', async () => {
        // Create a test emission record
        const emission = await Emission.create({
            userId,
            machineId: 'someMachineId',
            CEele: 1,
            CEtool: 1,
            CEcoolant: 1,
            CEm: 1,
            CEchip: 1,
            totalEmission: 5,
            parameters: {
                runTime: 10,
                toolMaterial: 'HSS',
                toolMass: 5,
                coolantType: 'Mineral',
                workpieceMaterial: 'steel',
                chipMass: 2,
            }
        });

        const response = await request(app)
            .get('/api/calculations/history')
            .set('Authorization', token)
            .expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].totalEmission).toBe(5);
    });
}); 