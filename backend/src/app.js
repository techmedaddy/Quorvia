const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const ErrorHandler = require('./utils/error.handler');

// Import Routes
const emailRoutes = require('./routes/email.routes');
const userRoutes = require('./routes/user.routes');

// Initialize the app
const app = express();

// Middleware
app.use(helmet()); // Enhance API security
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined')); // Log HTTP requests

// Route Handling
app.use('/api/emails', emailRoutes);
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(ErrorHandler.notFound); // Handle 404 errors
app.use(ErrorHandler.handleError); // Handle other errors

module.exports = app;