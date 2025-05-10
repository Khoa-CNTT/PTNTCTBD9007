const db = require('../config/db');

const viTriModel = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM ViTri');
    return results;
  },

  async getByType(loai_xe) {
    const [results] = await db.query('SELECT * FROM ViTri WHERE loai_xe = ?', [loai_xe]);
    return results;
  },

  async create(ten_vi_tri, id_bai_do, trang_thai, loai_xe) {
    const [result] = await db.query(
      'INSERT INTO ViTri (ten_vi_tri, id_bai_do, trang_thai, loai_xe) VALUES (?, ?, ?, ?)',
      [ten_vi_tri, id_bai_do, trang_thai, loai_xe]
    );
    return result.insertId;
  },

  async update(id, ten_vi_tri, id_bai_do, trang_thai, loai_xe) {
    await db.query(
      'UPDATE ViTri SET ten_vi_tri = ?, id_bai_do = ?, trang_thai = ?, loai_xe = ? WHERE id_vi_tri = ?',
      [ten_vi_tri, id_bai_do, trang_thai, loai_xe, id]
    );
  },

  async delete(id) {
    await db.query('DELETE FROM ViTri WHERE id_vi_tri = ?', [id]);
  }
};

module.exports = viTriModel;