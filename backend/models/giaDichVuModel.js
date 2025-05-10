const db = require('../config/db');

const giaDichVuModel = {
  async getAll() {
    const [results] = await db.query('SELECT * FROM GiaDichVu');
    return results;
  },

  async update(loai_xe, gia_theo_gio, gia_theo_thang) {
    await db.query(
      'INSERT INTO GiaDichVu (loai_xe, gia_theo_gio, gia_theo_thang) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE gia_theo_gio = ?, gia_theo_thang = ?',
      [loai_xe, gia_theo_gio, gia_theo_thang, gia_theo_gio, gia_theo_thang]
    );
  }
};

module.exports = giaDichVuModel;