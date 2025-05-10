const thongKeModel = require('../models/thongKeModel');

const thongKeController = {
  async getStats(req, res) {
    try {
      const stats = await thongKeModel.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thống kê', error: error.message });
    }
  },

  async getDetailedStats(req, res) {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Thiếu thông tin ngày bắt đầu hoặc kết thúc' });
    }

    try {
      const stats = await thongKeModel.getDetailedStats(startDate, endDate);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thống kê chi tiết', error: error.message });
    }
  }
};

module.exports = thongKeController;