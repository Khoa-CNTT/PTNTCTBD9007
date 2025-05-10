const db = require('../config/db');

const thongKeModel = {
  async getStats() {
    const [users] = await db.query('SELECT COUNT(*) AS total_users FROM NguoiDung');
    const [bookings] = await db.query('SELECT COUNT(*) AS total_bookings FROM DonDatCho');
    const [positions] = await db.query('SELECT COUNT(*) AS total_positions FROM ViTri');
    const [parkingLots] = await db.query('SELECT COUNT(*) AS total_parking_lots FROM BaiDo');

    return {
      total_users: users[0].total_users,
      total_bookings: bookings[0].total_bookings,
      total_positions: positions[0].total_positions,
      total_parking_lots: parkingLots[0].total_parking_lots
    };
  },

  async getDetailedStats(startDate, endDate) {
    const [stats] = await db.query(
      'SELECT loai_xe, gia_theo_gio, SUM(tong_gio_thue) AS total_hours, SUM(doanh_thu) AS total_revenue FROM ThongKe WHERE ngay BETWEEN ? AND ? GROUP BY loai_xe',
      [startDate, endDate]
    );
    const [dailyData] = await db.query(
      'SELECT ngay, SUM(doanh_thu) AS revenue, SUM(tien_von) AS capital FROM ThongKe WHERE ngay BETWEEN ? AND ? GROUP BY ngay',
      [startDate, endDate]
    );
    const [total] = await db.query(
      'SELECT SUM(doanh_thu) AS total_revenue, SUM(doanh_thu - tien_von) AS total_profit FROM ThongKe WHERE ngay BETWEEN ? AND ?',
      [startDate, endDate]
    );

    return {
      total_revenue: total[0].total_revenue,
      total_profit: total[0].total_profit,
      parking_stats: stats,
      daily_data: dailyData
    };
  }
};

module.exports = thongKeModel;