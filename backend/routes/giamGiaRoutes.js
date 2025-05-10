const express = require('express');
const giamGiaController = require('../controllers/giamGiaController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/giamgia', authenticateToken, authorizeAdmin, giamGiaController.getAll);
router.put('/giamgia', authenticateToken, authorizeAdmin, giamGiaController.update);

module.exports = router;