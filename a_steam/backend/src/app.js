const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const loggerMiddleware = require('./middlewares/logger.middleware');
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Request Logging Middleware
app.use(loggerMiddleware);

// JSON Parsing Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Health Route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json(new ApiResponse(200, null, 'API is running healthily'));
});

// System Info Route
app.get('/api/v1/system', (req, res) => {
    res.status(200).json(new ApiResponse(200, {
        platform: process.platform,
        nodeVersion: process.version,
        uptime: process.uptime()
    }, 'System info retrieved successfully'));
});

// Example route mounting (to be expanded)
// app.use('/api/v1/games', gameRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
