const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Tạo đơn đặt chỗ (không yêu cầu admin, nhưng cần đăng nhập hoặc có thể bỏ qua đăng nhập)
router.post('/bookings', authenticateToken, bookingController.createBooking);

// Lấy danh sách đơn đặt chỗ (chỉ admin)
router.get('/bookings', authenticateToken, authorizeAdmin, bookingController.getAllBookings);

// Cập nhật đơn đặt chỗ (chỉ admin)
router.put('/bookings/:id', authenticateToken, authorizeAdmin, bookingController.updateBooking);

// Xóa đơn đặt chỗ (chỉ admin)
router.delete('/bookings/:id', authenticateToken, authorizeAdmin, bookingController.deleteBooking);

module.exports = router;