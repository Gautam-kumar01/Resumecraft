module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Health check - with live Gemini test
    if (req.url === '/api/health' || req.url === '/api/health/') {
        let geminiStatus = 'not_tested';
        let geminiError = null;

        if (process.env.GEMINI_API_KEY) {
            try {
                const { GoogleGenerativeAI } = require('@google/generative-ai');
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                // Tiny test request
                const result = await model.generateContent("hi");
                if (result.response) {
                    geminiStatus = 'working';
                }
            } catch (err) {
                geminiStatus = 'error';
                geminiError = err.message;
            }
        } else {
            geminiStatus = 'missing_key';
        }

        return res.status(200).json({
            status: 'alive',
            timestamp: new Date().toISOString(),
            env: {
                hasMongo: !!process.env.MONGO_URI,
                hasJwt: !!process.env.JWT_SECRET,
                hasGoogle: !!process.env.GOOGLE_CLIENT_ID,
                gemini: {
                    status: geminiStatus,
                    error: geminiError
                }
            }
        });
    }

    // Load dependencies for actual API requests
    try {
        const express = require('express');
        const mongoose = require('mongoose');
        const dotenv = require('dotenv');

        dotenv.config();

        // Connect to database
        if (mongoose.connection.readyState !== 1) {
            if (!process.env.MONGO_URI) {
                return res.status(500).json({ error: 'Database not configured' });
            }

            mongoose.set('bufferCommands', false);
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000,
            });
        }

        // Create Express app
        const app = express();
        app.use(express.json());

        // Load routes
        const authRoutes = require('../server/routes/auth');
        const resumeRoutes = require('../server/routes/resume');
        const aiRoutes = require('../server/routes/ai');

        app.use('/api/auth', authRoutes);
        app.use('/api/resumes', resumeRoutes);
        app.use('/api/ai', aiRoutes);

        // Handle the request
        return app(req, res);

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
