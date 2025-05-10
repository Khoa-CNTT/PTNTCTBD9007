const express = require('express');
const baiDoController = require('../controllers/baiDoController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/baido', authenticateToken, authorizeAdmin, baiDoController.getAll);
router.post('/baido', authenticateToken, authorizeAdmin, baiDoController.create);
router.put('/baido/:id', authenticateToken, authorizeAdmin, baiDoController.update);
router.delete('/baido/:id', authenticateToken, authorizeAdmin, baiDoController.delete);

module.exports = router;