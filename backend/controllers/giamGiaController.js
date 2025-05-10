const giamGiaModel = require('../models/giamGiaModel');

const giamGiaController = {
  async getAll(req, res) {
    try {
      const discounts = await giamGiaModel.getAll();
      res.json(discounts);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách giảm giá', error: error.message });
    }
  },

  async update(req, res) {
    const { loai_xe, mot_thang, ba_thang, sau_thang, mot_nam } = req.body;
    if (!loai_xe || !mot_thang || !ba_thang || !sau_thang || !mot_nam) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    try {
      await giamGiaModel.update(loai_xe, mot_thang, ba_thang, sau_thang, mot_nam);
      res.json({ message: 'Cập nhật giảm giá thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật giảm giá', error: error.message });
    }
  }
};

module.exports = giamGiaController;