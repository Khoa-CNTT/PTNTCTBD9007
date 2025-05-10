const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token không tồn tại' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Thay 'your_jwt_secret' bằng biến môi trường
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user?.vai_tro !== 'Admin') {
    return res.status(403).json({ message: 'Chỉ admin được phép truy cập' });
  }
  next();
};

module.exports = { authenticateToken, authorizeAdmin };