const express = require('express');
const giaDichVuController = require('../controllers/giaDichVuController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/giadichvu', authenticateToken, authorizeAdmin, giaDichVuController.getAll);
router.put('/giadichvu', authenticateToken, authorizeAdmin, giaDichVuController.update);

module.exports = router;