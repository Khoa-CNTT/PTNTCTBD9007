const db = require('../config/db');

const baiDoModel = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM BaiDo');
    return results;
  },

  async create(ten_bai_do, dia_chi, suc_chua) {
    const [result] = await db.query(
      'INSERT INTO BaiDo (ten_bai_do, dia_chi, suc_chua) VALUES (?, ?, ?)',
      [ten_bai_do, dia_chi, suc_chua]
    );
    return result.insertId;
  },

  async update(id, ten_bai_do, dia_chi, suc_chua) {
    await db.query(
      'UPDATE BaiDo SET ten_bai_do = ?, dia_chi = ?, suc_chua = ? WHERE id_bai_do = ?',
      [ten_bai_do, dia_chi, suc_chua, id]
    );
  },

  async delete(id) {
    await db.query('DELETE FROM BaiDo WHERE id_bai_do = ?', [id]);
  }
};

module.exports = baiDoModel;