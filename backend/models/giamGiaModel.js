const db = require('../config/db');

const giamGiaModel = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM GiamGia');
    return results;
  },

  async update(loai_xe, mot_thang, ba_thang, sau_thang, mot_nam) {
    await db.query(
      'INSERT INTO GiamGia (loai_xe, mot_thang, ba_thang, sau_thang, mot_nam) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE mot_thang = ?, ba_thang = ?, sau_thang = ?, mot_nam = ?',
      [loai_xe, mot_thang, ba_thang, sau_thang, mot_nam, mot_thang, ba_thang, sau_thang, mot_nam]
    );
  }
};

module.exports = giamGiaModel;