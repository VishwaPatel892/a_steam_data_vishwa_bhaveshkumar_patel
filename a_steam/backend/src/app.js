import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import loggerMiddleware from './middlewares/logger.middleware.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';
import ApiResponse from './utils/apiResponse.js';
import routes from './routes/index.js';

const app = express();

// Security Middleware
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

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

// Cookie Parsing Middleware
app.use(cookieParser());

// Compression Middleware
app.use(compression());

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

// Routes
app.use('/api/v1', routes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
