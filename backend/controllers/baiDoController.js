const baiDoModel = require('../models/baiDoModel');

const baiDoController = {
  async getAll(req, res) {
    try {
      const parkingLots = await baiDoModel.getAll();
      res.json(parkingLots);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách bãi đỗ', error: error.message });
    }
  },

  async create(req, res) {
    const { ten_bai_do, dia_chi, suc_chua } = req.body;
    if (!ten_bai_do || !dia_chi || !suc_chua) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    try {
      const id_bai_do = await baiDoModel.create(ten_bai_do, dia_chi, suc_chua);
      res.status(201).json({ message: 'Tạo bãi đỗ thành công', id_bai_do });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo bãi đỗ', error: error.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { ten_bai_do, dia_chi, suc_chua } = req.body;

    try {
      await baiDoModel.update(id, ten_bai_do, dia_chi, suc_chua);
      res.json({ message: 'Cập nhật bãi đỗ thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật bãi đỗ', error: error.message });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    try {
      await baiDoModel.delete(id);
      res.json({ message: 'Xóa bãi đỗ thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa bãi đỗ', error: error.message });
    }
  }
};

module.exports = baiDoController;