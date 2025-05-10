const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/users', authenticateToken, authorizeAdmin, userController.createUser);
router.get('/users', authenticateToken, authorizeAdmin, userController.getAllUsers);
router.put('/users/:id', authenticateToken, authorizeAdmin, userController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeAdmin, userController.deleteUser);

module.exports = router;