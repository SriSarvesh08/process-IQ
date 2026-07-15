require('dotenv').config();
const app = require('../app');
const connectDB = require('../config/db');

// Connect to database before handling the request
connectDB();

// Export the Express app as a serverless function for Vercel
module.exports = app;
