// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM NguoiDung WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const user = results[0];

    // Kiểm tra mật khẩu
    bcrypt.compare(password, user.mat_khau, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      // Tạo token JWT
      const token = jwt.sign(
        { id: user.id_nguoi_dung, vai_tro: user.vai_tro },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user.id_nguoi_dung,
          email: user.email,
          vai_tro: user.vai_tro,
          ho_ten: user.ho_ten,
          so_dien_thoai: user.so_dien_thoai,
          avatar: user.avatar
        }
      });
    });
  });
};

module.exports = { login };
