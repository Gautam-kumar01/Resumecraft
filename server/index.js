
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('--- Environment Diagnostics ---');
console.log('PORT:', process.env.PORT || 'not set (default 5000)');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'MISSING');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'MISSING');
console.log('-------------------------------');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Disable buffering so we don't get the "buffering timed out" 10s hang
mongoose.set('bufferCommands', false);

// Database Connection
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('CRITICAL: MONGO_URI is not defined in environment variables!');
    return;
  }

  // If already connected, don't reconnect
  if (mongoose.connection.readyState >= 1) return;

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

// Initial connection attempt
connectDB();

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      readyState: mongoose.connection.readyState
    },
    vercelConfig: {
      hasMongo: !!process.env.MONGO_URI,
      hasJwt: !!process.env.JWT_SECRET,
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      nodeEnv: process.env.NODE_ENV
    },
    tip: 'If any "hasX" is false, add that variable in Vercel Dashboard > Settings > Environment Variables.'
  });
});

// Middleware to ensure DB connection before processing requests
const ensureDb = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: 'Database is starting or unreachable. Please try again in a few seconds.',
        retryAfter: 5
      });
    }
  }
  next();
};

app.use('/api/auth', ensureDb, require('./routes/auth'));
app.use('/api/resumes', ensureDb, require('./routes/resume'));

app.get('/', (req, res) => {
  res.send('ResumeCraft API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
