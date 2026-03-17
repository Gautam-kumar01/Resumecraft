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

                // Try a few common models to see which one is active
                const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash"];
                let successModel = null;

                for (const modelName of modelsToTry) {
                    try {
                        const model = genAI.getGenerativeModel({ model: modelName });
                        const result = await model.generateContent("hi");
                        if (result.response) {
                            successModel = modelName;
                            geminiStatus = 'working';
                            break;
                        }
                    } catch (e) {
                        geminiError = (geminiError ? geminiError + " | " : "") + `${modelName}: ${e.message}`;
                    }
                }

                if (successModel) {
                    geminiStatus = `working (${successModel})`;
                    geminiError = null; // Clear errors if at least one worked
                } else {
                    geminiStatus = 'error';
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
            const uri = process.env.MONGO_URI;
            if (!uri) {
                console.error('API Error: MONGO_URI is missing');
                return res.status(500).json({ 
                    error: 'Database not configured',
                    message: 'MONGO_URI is missing in environment variables. Please add it in Vercel Dashboard.'
                });
            }

            // Ensure we're not trying to connect to localhost on Vercel
            if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
                console.error('API Error: Attempted to connect to localhost on Vercel');
                return res.status(500).json({ 
                    error: 'Invalid Database Configuration',
                    message: 'MONGO_URI points to localhost. Use MongoDB Atlas for production.'
                });
            }

            mongoose.set('bufferCommands', false);
            try {
                await mongoose.connect(uri, {
                    serverSelectionTimeoutMS: 5000,
                    connectTimeoutMS: 10000,
                });
            } catch (connError) {
                console.error('Database Connection Error:', connError.message);
                return res.status(503).json({
                    error: 'Database Connection Failed',
                    message: connError.message
                }); 
            }
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
