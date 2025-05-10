const db = require('../config/db');

const phanHoiModel = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM PhanHoi');
    return results;
  },

  async search(searchTerm) {
    const query = `
      SELECT * FROM PhanHoi 
      WHERE ten_khach_hang LIKE ? 
      OR so_dien_thoai LIKE ? 
      OR noi_dung LIKE ?
    `;
    const [results] = await db.query(query, [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`
    ]);
    return results;
  },

  async create(feedbackData) {
    const {
      ten_khach_hang,
      so_dien_thoai,
      email,
      noi_dung,
      danh_gia,
      id_bai_do
    } = feedbackData;

    const [result] = await db.query(
      `INSERT INTO PhanHoi 
      (ten_khach_hang, so_dien_thoai, email, noi_dung, danh_gia, id_bai_do, ngay_nhan) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [ten_khach_hang, so_dien_thoai, email, noi_dung, danh_gia, id_bai_do]
    );
    return result.insertId;
  }
};

module.exports = phanHoiModel;