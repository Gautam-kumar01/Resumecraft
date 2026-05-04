const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Basic Middleware
app.use(cors());
app.use(express.json());

// Database connection helper (Singleton-ish)
let isConnected = false;
const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) return;
    
    try {
        mongoose.set('bufferCommands', false);
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('DB Connection Error:', err.message);
        throw err;
    }
};

// Health Check
app.get('/api/health', async (req, res) => {
    res.json({
        status: 'alive',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        features: {
            gemini: !!process.env.GEMINI_API_KEY,
            deepseek: !!process.env.DEEPSEEK_API_KEY,
            groq: !!process.env.GROQ_API_KEY
        }
    });
});

// AI Routes (Don't necessarily need DB for simple suggestions)
app.use('/api/ai', require('../server/routes/ai'));

// Protected Routes (Need DB)
const withDB = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({ error: 'Database Connection Failed', message: err.message });
    }
};

app.use('/api/auth', withDB, require('../server/routes/auth'));
app.use('/api/resumes', withDB, require('../server/routes/resume'));

// Root path
app.get('/', (req, res) => res.send('ResumeCraft API is operational.'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

module.exports = app;
