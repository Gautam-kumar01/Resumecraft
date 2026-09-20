
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const SERVER_STARTED_AT = Date.now();

console.log('--- Environment Diagnostics ---');
console.log('PORT:', process.env.PORT || 'not set (default 5000)');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'MISSING');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'MISSING');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'MISSING');
console.log('DEEPSEEK_API_KEY:', process.env.DEEPSEEK_API_KEY ? 'SET' : 'MISSING');
console.log('-------------------------------');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '4mb' }));

app.set('trust proxy', 1);

const globalApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP. Please wait a moment and try again.',
    code: 'RATE_LIMITED_GLOBAL',
    retryAfterMs: 60_000,
  },
});
app.use('/api/', globalApiLimiter);

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

const AI_PROVIDERS = [
  { name: 'Gemini', key: 'GEMINI_API_KEY', endpoint: 'https://generativelanguage.googleapis.com/$discovery/rest?version=v1beta' },
  { name: 'DeepSeek', key: 'DEEPSEEK_API_KEY', endpoint: 'https://api.deepseek.com/v1/models' },
  { name: 'Groq', key: 'GROQ_API_KEY', endpoint: 'https://api.groq.com/openai/v1/models' },
  { name: 'Manus', key: 'MANUS_API_KEY', endpoint: 'https://api.manus.im/v1/models' },
];

const probeUrl = async (url, timeoutMs = 1500) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const start = performance.now();
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal }).catch(() => null);
    clearTimeout(timeout);
    const latency = Math.round(performance.now() - start);
    return { reachable: !!res || true /* HEAD may fail; just checking network */, latencyMs: latency };
  } catch (_) {
    return { reachable: false, latencyMs: null };
  }
};

const measureDbPing = async () => {
  if (mongoose.connection.readyState !== 1) return { ok: false, latencyMs: null };
  try {
    const start = performance.now();
    const admin = mongoose.connection.db.admin();
    const pinged = await admin.ping();
    return { ok: !!pinged?.ok, latencyMs: Math.round(performance.now() - start) };
  } catch (err) {
    return { ok: false, latencyMs: null, error: err.message };
  }
};

// Routes
app.get('/api/health', async (req, res) => {
  const dbPing = await measureDbPing();
  const providers = AI_PROVIDERS.map((provider) => ({
    name: provider.name,
    keySet: !!process.env[provider.key],
  }));

  const anyAiConfigured = providers.some((p) => p.keySet);

  const overall = (() => {
    if (!anyAiConfigured) return 'degraded';
    if (mongoose.connection.readyState !== 1 || !dbPing.ok) return 'degraded';
    return 'ok';
  })();

  const uptimeMs = Date.now() - SERVER_STARTED_AT;
  const uptimeSeconds = Math.round(uptimeMs / 1000);
  const uptimeHuman = (() => {
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (!parts.length) parts.push(`${uptimeSeconds}s`);
    return parts.join(' ');
  })();

  res.json({
    status: overall,
    uptimeMs,
    uptimeSeconds,
    uptimeHuman,
    startedAtIso: new Date(SERVER_STARTED_AT).toISOString(),
    mongodb: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      readyState: mongoose.connection.readyState,
      ping: dbPing,
    },
    aiProviders: providers,
    vercelConfig: {
      hasMongo: !!process.env.MONGO_URI,
      hasJwt: !!process.env.JWT_SECRET,
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      hasGemini: !!process.env.GEMINI_API_KEY,
      hasDeepseek: !!process.env.DEEPSEEK_API_KEY,
      nodeEnv: process.env.NODE_ENV,
    },
    tip: 'If any "hasX" is false, add that variable in your .env file or Vercel Dashboard.',
  });
});

// Routes that don't need DB
app.use('/api/ai', require('./routes/ai'));

// Middleware to ensure DB connection before processing other requests
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

// Presence tracking is anonymous and uses a short-lived MongoDB record per browser.
app.use('/api/presence', ensureDb, require('./routes/presence'));
app.use('/api/auth', ensureDb, require('./routes/auth'));
app.use('/api/resumes', ensureDb, require('./routes/resume'));
app.use('/api/cover-letters', ensureDb, require('./routes/coverLetter'));
app.use('/api/job-matches', ensureDb, require('./routes/jobMatch'));

app.get('/', (req, res) => {
  res.send('ResumeCraft API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err?.status === 429 || err?.name === 'RateLimitExceeded') {
    return res.status(429).json({
      message: err.message || 'Too many requests.',
      code: err.code || 'RATE_LIMITED',
      retryAfterMs: err.retryAfterMs || 60_000,
    });
  }
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
