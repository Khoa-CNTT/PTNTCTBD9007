const express = require('express');
const viTriController = require('../controllers/viTriController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/vitri', authenticateToken, authorizeAdmin, viTriController.getAll);
router.get('/vitri/type', authenticateToken, authorizeAdmin, viTriController.getByType);
router.post('/vitri', authenticateToken, authorizeAdmin, viTriController.create);
router.put('/vitri/:id', authenticateToken, authorizeAdmin, viTriController.update);
router.delete('/vitri/:id', authenticateToken, authorizeAdmin, viTriController.delete);

module.exports = router;