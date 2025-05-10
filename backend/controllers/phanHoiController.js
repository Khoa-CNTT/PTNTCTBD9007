const phanHoiModel = require('../models/phanHoiModel');

const phanHoiController = {
  async getAll(req, res) {
    try {
      const feedbacks = await phanHoiModel.getAll();
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách phản hồi', error: error.message });
    }
  },

  async search(req, res) {
    const { searchTerm } = req.query;
    try {
      const feedbacks = await phanHoiModel.search(searchTerm);
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tìm kiếm phản hồi', error: error.message });
    }
  }
};

module.exports = phanHoiController;