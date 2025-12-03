const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.use(protect);

router.get('/news', adminController.getAllNews);
router.post('/news', adminController.createNews);
router.put('/news/:id', adminController.updateNews);
router.delete('/news/:id', adminController.deleteNews);

module.exports = router;
