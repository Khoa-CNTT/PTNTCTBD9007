const viTriModel = require('../models/viTriModel');

const viTriController = {
  async getAll(req, res) {
    try {
      const positions = await viTriModel.getAll();
      res.json(positions);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách vị trí', error: error.message });
    }
  },

  async getByType(req, res) {
    const { loai_xe } = req.query;
    if (!loai_xe) {
      return res.status(400).json({ message: 'Thiếu thông tin loại xe' });
    }

    try {
      const positions = await viTriModel.getByType(loai_xe);
      res.json(positions);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách vị trí theo loại xe', error: error.message });
    }
  },

  async create(req, res) {
    const { ten_vi_tri, id_bai_do, trang_thai, loai_xe } = req.body;
    if (!ten_vi_tri || !id_bai_do || !trang_thai || !loai_xe) {
      return res.status(400).json({ message: 'Thiếu thông tin' });
    }

    try {
      const id_vi_tri = await viTriModel.create(ten_vi_tri, id_bai_do, trang_thai, loai_xe);
      res.status(201).json({ message: 'Tạo vị trí thành công', id_vi_tri });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo vị trí', error: error.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { ten_vi_tri, id_bai_do, trang_thai, loai_xe } = req.body;

    try {
      await viTriModel.update(id, ten_vi_tri, id_bai_do, trang_thai, loai_xe);
      res.json({ message: 'Cập nhật vị trí thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật vị trí', error: error.message });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    try {
      await viTriModel.delete(id);
      res.json({ message: 'Xóa vị trí thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa vị trí', error: error.message });
    }
  }
};

module.exports = viTriController;