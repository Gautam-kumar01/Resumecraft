const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const controller = require('../controllers/jobMatchController');

router.use(protect);
router.get('/', controller.listJobMatches);
router.get('/:id', controller.getJobMatch);
router.post('/', controller.createJobMatch);
router.put('/:id', controller.updateJobMatch);
router.delete('/:id', controller.deleteJobMatch);

module.exports = router;
