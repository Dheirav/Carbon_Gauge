const express = require('express');
const app = express();
const settingsRouter = require('./routes/settings');

// ... after your other middleware and routes
app.use('/api/settings', settingsRouter); 