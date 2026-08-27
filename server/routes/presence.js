const express = require('express');
const ActiveVisitor = require('../models/ActiveVisitor');

const router = express.Router();
const ACTIVE_WINDOW_MS = 90 * 1000;

const isValidVisitorId = (visitorId) => typeof visitorId === 'string' && /^[a-zA-Z0-9_-]{16,128}$/.test(visitorId);

router.post('/heartbeat', async (req, res, next) => {
  try {
    const { visitorId } = req.body || {};
    if (!isValidVisitorId(visitorId)) {
      return res.status(400).json({ message: 'A valid visitorId is required.' });
    }

    await ActiveVisitor.findOneAndUpdate(
      { visitorId },
      { $set: { lastSeenAt: new Date() } },
      { upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

router.get('/online', async (_req, res, next) => {
  try {
    const since = new Date(Date.now() - ACTIVE_WINDOW_MS);
    const online = await ActiveVisitor.countDocuments({ lastSeenAt: { $gte: since } });
    return res.json({ online, windowSeconds: ACTIVE_WINDOW_MS / 1000 });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

