
const express = require('express');
const router = express.Router();
const {
    getResumes,
    getResumeById,
    createResume,
    updateResume,
    deleteResume,
    getPublicResume,
    generatePDF
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getResumes).post(protect, createResume);
router.route('/pdf').post(protect, generatePDF);
router.route('/:id').get(protect, getResumeById).put(protect, updateResume).delete(protect, deleteResume);
router.route('/public/:id').get(getPublicResume); // Public route

module.exports = router;
