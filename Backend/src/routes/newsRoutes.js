const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/', newsController.getNews);
router.post('/analyze', newsController.analyzeNews);

module.exports = router;
