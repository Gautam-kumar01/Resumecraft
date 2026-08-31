const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const multer = require('multer');

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

router.post('/suggest', aiController.getSuggestions);
router.post('/improve-text', aiController.improveText);
router.post('/summary-options', aiController.generateSummaryOptions);
router.post('/suggest-skills', aiController.suggestSkills);
router.post('/analyze-ats', aiController.analyzeAts);
router.post('/match-job', aiController.matchJobDescription);
router.post('/tailor-resume', aiController.tailorResume);
router.post('/import-resume', upload.single('resume'), aiController.importResume);
router.post('/export-docx', aiController.exportDocx);
router.post('/generate-cover-letter', aiController.generateCoverLetter);
router.post('/interview-questions', aiController.generateInterviewQuestions);
router.post('/evaluate-interview', aiController.evaluateInterviewAnswer);

module.exports = router;
