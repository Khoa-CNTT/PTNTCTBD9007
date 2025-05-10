const db = require('../config/db');

const userModel = {
  async findByEmail(email) {
    const [results] = await db.query('SELECT * FROM NguoiDung WHERE email = ?', [email]);
    return results[0];
  },

  async findByEmailOrPhone(email, so_dien_thoai) {
    const [results] = await db.query('SELECT * FROM NguoiDung WHERE email = ? OR so_dien_thoai = ?', [email, so_dien_thoai]);
    return results;
  },

  async create(ho_ten, email, so_dien_thoai, mat_khau) {
    await db.query(
      'INSERT INTO NguoiDung (ho_ten, email, so_dien_thoai, mat_khau, vai_tro, ngay_tao, is_active, is_locked) VALUES (?, ?, ?, ?, "User", NOW(), TRUE, FALSE)',
      [ho_ten, email, so_dien_thoai, mat_khau]
    );
  },

  async getAllActiveUsers() {
    const [results] = await db.query('SELECT ho_ten, email, so_dien_thoai FROM NguoiDung WHERE is_active = TRUE');
    return results;
  },

  async findById(id) {
    const [results] = await db.query('SELECT * FROM NguoiDung WHERE id_nguoi_dung = ?', [id]);
    return results[0];
  },

  async updateUser(id, ho_ten, email, so_dien_thoai, vai_tro, is_active, is_locked) {
    await db.query(
      'UPDATE NguoiDung SET ho_ten = ?, email = ?, so_dien_thoai = ?, vai_tro = ?, is_active = ?, is_locked = ? WHERE id_nguoi_dung = ?',
      [ho_ten, email, so_dien_thoai, vai_tro, is_active, is_locked, id]
    );
  },

  async deleteUser(id) {
    await db.query('DELETE FROM NguoiDung WHERE id_nguoi_dung = ?', [id]);
  }
};


module.exports = userModel;