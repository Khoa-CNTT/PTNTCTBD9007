const express = require('express');
const thongKeController = require('../controllers/thongKeController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/thongke', authenticateToken, authorizeAdmin, thongKeController.getStats);
router.get('/thongke/detailed', authenticateToken, authorizeAdmin, thongKeController.getDetailedStats);

module.exports = router;