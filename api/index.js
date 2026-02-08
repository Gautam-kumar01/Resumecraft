module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.url === '/api/health' || req.url === '/api/health/') {
        return res.status(200).json({
            status: 'alive',
            timestamp: new Date().toISOString()
        });
    }

    try {
        const express = require('express');
        const app = express();
        app.use(express.json());

        app.all('*', (req, res) => {
            res.json({ message: 'API is working', path: req.path });
        });

        return app(req, res);
    } catch (error) {
        return res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};
