const express = require('express');
const phanHoiController = require('../controllers/phanHoiController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/phanhoi', authenticateToken, authorizeAdmin, phanHoiController.getAll);
router.get('/phanhoi/search', authenticateToken, authorizeAdmin, phanHoiController.search);

module.exports = router;    