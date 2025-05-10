const giaDichVuModel = require('../models/giaDichVuModel');

const giaDichVuController = {
  async getAll(req, res) {
    try {
      const prices = await giaDichVuModel.getAll();
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách giá', error: error.message });
    }
  },

  async update(req, res) {
    const { loai_xe, gia_theo_gio, gia_theo_thang } = req.body;
    if (!loai_xe || !gia_theo_gio || !gia_theo_thang) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    try {
      await giaDichVuModel.update(loai_xe, gia_theo_gio, gia_theo_thang);
      res.json({ message: 'Cập nhật giá thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật giá', error: error.message });
    }
  }
};

module.exports = giaDichVuController;