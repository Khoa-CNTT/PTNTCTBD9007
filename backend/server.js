const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Điều chỉnh origin theo môi trường (frontend)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const viTriRoutes = require('./routes/viTriRoutes');
const baiDoRoutes = require('./routes/baiDoRoutes');
const thongKeRoutes = require('./routes/thongKeRoutes');
const phanHoiRoutes = require('./routes/phanHoiRoutes');
const giaDichVuRoutes = require('./routes/giaDichVuRoutes');
const giamGiaRoutes = require('./routes/giamGiaRoutes');

app.use('/api', userRoutes);
app.use('/api', bookingRoutes);
app.use('/api', viTriRoutes);
app.use('/api', baiDoRoutes);
app.use('/api', thongKeRoutes);
app.use('/api', phanHoiRoutes);
app.use('/api', giaDichVuRoutes);
app.use('/api', giamGiaRoutes);

// Kiểm tra kết nối cơ sở dữ liệu trước khi khởi động server
const checkDatabaseConnection = async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ Kết nối cơ sở dữ liệu thành công');
  } catch (error) {
    console.error('❌ Lỗi kết nối cơ sở dữ liệu:', error.message);
    process.exit(1); // Thoát nếu không kết nối được
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Lỗi server:', err.stack);
  res.status(500).json({
    message: 'Có lỗi xảy ra từ phía server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Khởi động server
const startServer = async () => {
  await checkDatabaseConnection();
  app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
  });
};

startServer().catch((err) => {
  console.error('Lỗi khi khởi động server:', err);
  process.exit(1);
});