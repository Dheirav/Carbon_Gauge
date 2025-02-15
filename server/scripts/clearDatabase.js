const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const User = require('../models/User');
const Emission = require('../models/Emission');
const Machine = require('../models/Machine');

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear all documents from collections
    await User.deleteMany({});
    console.log('User collection cleared');

    await Emission.deleteMany({});
    console.log('Emission collection cleared');

    await Machine.deleteMany({});
    console.log('Machine collection cleared');

    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing the database:', error);
  } finally {
    mongoose.connection.close();
  }
};

clearDatabase(); 