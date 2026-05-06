
const express = require('express');
const router = express.Router();
const {
    getCoverLetters,
    getCoverLetterById,
    createCoverLetter,
    updateCoverLetter,
    deleteCoverLetter,
    getStarters
} = require('../controllers/coverLetterController');
const { protect } = require('../middleware/auth');

router.route('/starters').get(getStarters);
router.route('/').get(protect, getCoverLetters).post(protect, createCoverLetter);
router.route('/:id').get(protect, getCoverLetterById).put(protect, updateCoverLetter).delete(protect, deleteCoverLetter);

module.exports = router;
