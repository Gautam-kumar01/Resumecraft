const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const multer = require('multer');
const rateLimit = require('express-rate-limit');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const extension = file.originalname.toLowerCase().split('.').pop();
    if (allowed.includes(file.mimetype) || ['pdf', 'docx'].includes(extension)) callback(null, true);
    else callback(new Error('Only PDF and DOCX files are supported.'));
  },
});

const keyGenerator = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = JSON.parse(Buffer.from(authHeader.split(' ')[1].split('.')[1], 'base64').toString());
      return `user:${payload.id || payload.sub || payload.userId || 'anon'}`;
    } catch (_) {}
  }
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded?.[0]) || req.ip || req.socket?.remoteAddress || 'unknown';
  return `ip:${ip}`;
};

const strictAiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many AI requests from this session. Please wait a minute and try again.',
      code: 'RATE_LIMITED_AI',
      retryAfterMs: 60_000,
    });
  },
});

const importLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many file imports. Please wait a few minutes before trying again.',
      code: 'RATE_LIMITED_IMPORT',
      retryAfterMs: 5 * 60_000,
    });
  },
});

const lightAiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests. Please wait a moment and try again.',
      code: 'RATE_LIMITED_TOOL',
      retryAfterMs: 60_000,
    });
  },
});

router.post('/suggest', strictAiLimiter, aiController.getSuggestions);
router.post('/improve-text', strictAiLimiter, aiController.improveText);
router.post('/summary-options', strictAiLimiter, aiController.generateSummaryOptions);
router.post('/suggest-skills', strictAiLimiter, aiController.suggestSkills);
router.post('/skill-gap', strictAiLimiter, aiController.analyzeSkillGap);
router.post('/analyze-ats', lightAiLimiter, aiController.analyzeAts);
router.post('/deep-analyze-resume', lightAiLimiter, aiController.deepAnalyzeResume);
router.post('/match-job', lightAiLimiter, aiController.matchJobDescription);
router.post('/tailor-resume', strictAiLimiter, aiController.tailorResume);
router.post('/import-resume', importLimiter, upload.single('resume'), aiController.importResume);
router.post('/export-docx', lightAiLimiter, aiController.exportDocx);
router.post('/generate-cover-letter', strictAiLimiter, aiController.generateCoverLetter);
router.post('/interview-questions', strictAiLimiter, aiController.generateInterviewQuestions);
router.post('/evaluate-interview', strictAiLimiter, aiController.evaluateInterviewAnswer);

router.use((err, req, res, next) => {
  if (err?.message?.toLowerCase?.().includes('only pdf and docx') || err?.name === 'MulterError') {
    return res.status(422).json({ message: err.message || 'Unable to process this upload.' });
  }
  if (err) {
    console.error('[AI ROUTE ERROR]', err);
    return res.status(500).json({ message: 'Unexpected error in AI router.' });
  }
  next();
});

module.exports = router;
