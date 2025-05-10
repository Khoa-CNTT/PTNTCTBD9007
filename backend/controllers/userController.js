const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const userController = {
  async register(req, res) {
    const { ho_ten, email, so_dien_thoai, mat_khau } = req.body;
    if (!ho_ten || !email || !so_dien_thoai || !mat_khau) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
      const existingUsers = await userModel.findByEmailOrPhone(email, so_dien_thoai);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại' });
      }

      const hashedPassword = bcrypt.hashSync(mat_khau, 10);
      await userModel.create(ho_ten, email, so_dien_thoai, hashedPassword);
      res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi đăng ký', error: error.message });
    }
  },

  async createUser(req, res) {
    const { ho_ten, email, so_dien_thoai, mat_khau, vai_tro, is_active, is_locked, avatar } = req.body;
    if (!ho_ten || !email || !so_dien_thoai || !mat_khau || !vai_tro) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
      const existingUsers = await userModel.findByEmailOrPhone(email, so_dien_thoai);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại' });
      }

      const hashedPassword = bcrypt.hashSync(mat_khau, 10);
      await userModel.create(ho_ten, email, so_dien_thoai, hashedPassword);
      const [newUser] = await db.query('SELECT * FROM NguoiDung WHERE email = ?', [email]);
      await userModel.updateUser(newUser[0].id_nguoi_dung, ho_ten, email, so_dien_thoai, vai_tro, is_active, is_locked);
      res.status(201).json({ message: 'Tạo tài khoản thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo tài khoản', error: error.message });
    }
  },

  async login(req, res) {
    const { email, mat_khau } = req.body;
    if (!email || !mat_khau) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    try {
      const user = await userModel.findByEmail(email);
      if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

      if (!user.is_active) return res.status(403).json({ message: 'Tài khoản chưa được kích hoạt' });
      if (user.is_locked) return res.status(403).json({ message: 'Tài khoản đã bị khóa' });

      if (!bcrypt.compareSync(mat_khau, user.mat_khau)) {
        return res.status(400).json({ message: 'Sai mật khẩu' });
      }

      res.json({
        message: 'Đăng nhập thành công',
        user: {
          id: user.id_nguoi_dung,
          ho_ten: user.ho_ten,
          email: user.email,
          so_dien_thoai: user.so_dien_thoai,
          vai_tro: user.vai_tro,
          avatar: user.avatar || null
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await userModel.getAllActiveUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: error.message });
    }
  },

  async updateUser(req, res) {
    const { id } = req.params;
    const { ho_ten, email, so_dien_thoai, vai_tro, is_active, is_locked } = req.body;

    try {
      await userModel.updateUser(id, ho_ten, email, so_dien_thoai, vai_tro, is_active, is_locked);
      res.json({ message: 'Cập nhật người dùng thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: error.message });
    }
  },

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      await userModel.deleteUser(id);
      res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: error.message });
    }
  }
};

module.exports = userController;