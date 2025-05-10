const db = require('../config/db');

const bookingModel = {
  async create(bookingData) {
    const {
      id_nguoi_dung,
      id_bai_do,
      vi_tri,
      loai_xe,
      thoi_gian_bat_dau,
      thoi_gian_ket_thuc,
      thoi_gian_thue,
      tong_tien,
      phuong_thuc_thanh_toan,
      ma_qr,
      trang_thai = 'Pending'
    } = bookingData;

    const [result] = await db.query(
      `INSERT INTO DonDatCho (
        id_nguoi_dung, id_bai_do, vi_tri, loai_xe, thoi_gian_bat_dau, thoi_gian_ket_thuc,
        thoi_gian_thue, tong_tien, phuong_thuc_thanh_toan, ma_qr, trang_thai
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_nguoi_dung || null,
        id_bai_do,
        vi_tri,
        loai_xe,
        thoi_gian_bat_dau,
        thoi_gian_ket_thuc,
        thoi_gian_thue,
        tong_tien,
        phuong_thuc_thanh_toan,
        ma_qr,
        trang_thai
      ]
    );

    // Cập nhật trạng thái vị trí đỗ xe
    const positions = vi_tri.split(',');
    for (const position of positions) {
      await db.query(
        'UPDATE ViTri SET trang_thai = ? WHERE ten_vi_tri = ? AND id_bai_do = ?',
        ['Occupied', position.trim(), id_bai_do]
      );
    }

    return result.insertId;
  },

  async getAllBookings() {
    const [results] = await db.query(`
      SELECT ddc.*, nd.ten_khach_hang, bd.ten_bai_do 
      FROM DonDatCho ddc
      LEFT JOIN NguoiDung nd ON ddc.id_nguoi_dung = nd.id_nguoi_dung
      LEFT JOIN BaiDo bd ON ddc.id_bai_do = bd.id_bai_do
    `);
    return results;
  },

  async getBookingById(id) {
    const [results] = await db.query(
      'SELECT * FROM DonDatCho WHERE id_don = ?',
      [id]
    );
    return results[0];
  },

  async updateBooking(id, updateData) {
    const {
      thoi_gian_bat_dau,
      thoi_gian_ket_thuc,
      thoi_gian_thue,
      trang_thai,
      vi_tri,
      tong_tien,
      phuong_thuc_thanh_toan,
      ma_qr
    } = updateData;

    // Lấy thông tin đơn cũ để biết vị trí cũ
    const oldBooking = await this.getBookingById(id);
    if (!oldBooking) {
      throw new Error('Đơn đặt chỗ không tồn tại');
    }

    // Cập nhật trạng thái vị trí cũ thành Available
    const oldPositions = oldBooking.vi_tri.split(',');
    for (const position of oldPositions) {
      await db.query(
        'UPDATE ViTri SET trang_thai = ? WHERE ten_vi_tri = ? AND id_bai_do = ?',
        ['Available', position.trim(), oldBooking.id_bai_do]
      );
    }

    // Cập nhật đơn đặt chỗ
    await db.query(
      `UPDATE DonDatCho 
       SET thoi_gian_bat_dau = ?, thoi_gian_ket_thuc = ?, thoi_gian_thue = ?, 
           trang_thai = ?, vi_tri = ?, tong_tien = ?, phuong_thuc_thanh_toan = ?, ma_qr = ?
       WHERE id_don = ?`,
      [
        thoi_gian_bat_dau || oldBooking.thoi_gian_bat_dau,
        thoi_gian_ket_thuc || oldBooking.thoi_gian_ket_thuc,
        thoi_gian_thue || oldBooking.thoi_gian_thue,
        trang_thai || oldBooking.trang_thai,
        vi_tri || oldBooking.vi_tri,
        tong_tien || oldBooking.tong_tien,
        phuong_thuc_thanh_toan || oldBooking.phuong_thuc_thanh_toan,
        ma_qr || oldBooking.ma_qr,
        id
      ]
    );

    // Cập nhật trạng thái vị trí mới thành Occupied
    if (vi_tri) {
      const newPositions = vi_tri.split(',');
      for (const position of newPositions) {
        await db.query(
          'UPDATE ViTri SET trang_thai = ? WHERE ten_vi_tri = ? AND id_bai_do = ?',
          ['Occupied', position.trim(), oldBooking.id_bai_do]
        );
      }
    }
  },

  async deleteBooking(id) {
    const booking = await this.getBookingById(id);
    if (!booking) {
      throw new Error('Đơn đặt chỗ không tồn tại');
    }

    // Cập nhật trạng thái vị trí thành Available
    const positions = booking.vi_tri.split(',');
    for (const position of positions) {
      await db.query(
        'UPDATE ViTri SET trang_thai = ? WHERE ten_vi_tri = ? AND id_bai_do = ?',
        ['Available', position.trim(), booking.id_bai_do]
      );
    }

    await db.query('DELETE FROM DonDatCho WHERE id_don = ?', [id]);
  }
};

module.exports = bookingModel;