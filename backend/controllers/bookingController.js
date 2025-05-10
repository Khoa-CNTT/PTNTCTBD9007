const userModel = require('../models/userModel');
const bookingModel = require('../models/bookingModel');
const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', // Thay 'live' khi đi sản xuất
  'client_id': 'YOUR_PAYPAL_CLIENT_ID', // Thay bằng Client ID của bạn
  'client_secret': 'YOUR_PAYPAL_CLIENT_SECRET' // Thay bằng Client Secret của bạn
});

const bookingController = {
  async createBooking(req, res) {
    const {
      customerInfo,
      parkingLotId,
      positions,
      vehicleType,
      startDate,
      endDate,
      duration,
      total,
      paymentMethod,
      qrCode
    } = req.body;

    if (!parkingLotId || !positions || !vehicleType || !startDate || !endDate || !duration || !total || !paymentMethod) {
      return res.status(400).json({ message: 'Thiếu thông tin khi tạo đơn' });
    }

    try {
      // Nếu có thông tin người dùng (đã đăng nhập), lấy id_nguoi_dung
      let id_nguoi_dung = null;
      if (req.user) {
        id_nguoi_dung = req.user.id_nguoi_dung;
      }

      const bookingData = {
        id_nguoi_dung,
        id_bai_do: parkingLotId,
        vi_tri: positions.join(','),
        loai_xe: vehicleType,
        thoi_gian_bat_dau: new Date(startDate),
        thoi_gian_ket_thuc: new Date(endDate),
        thoi_gian_thue: duration,
        tong_tien: total,
        phuong_thuc_thanh_toan: paymentMethod,
        ma_qr: qrCode || null,
        trang_thai: 'Pending' // Mặc định là Pending, sẽ cập nhật sau
      };

      if (paymentMethod === 'paypal') {
        // Tạo thanh toán PayPal
        const create_payment_json = {
          "intent": "sale",
          "payer": {
            "payment_method": "paypal"
          },
          "redirect_urls": {
            "return_url": `http://localhost:3000/api/bookings/payment/success`,
            "cancel_url": `http://localhost:3000/api/bookings/payment/cancel`
          },
          "transactions": [{
            "item_list": {
              "items": [{
                "name": `Parking at ${parkingLotId}`,
                "sku": "parking",
                "price": (total / 23000).toFixed(2), // Chuyển VNĐ sang USD (1 USD ~ 23,000 VNĐ)
                "currency": "USD",
                "quantity": 1
              }]
            },
            "amount": {
              "currency": "USD",
              "total": (total / 23000).toFixed(2)
            },
            "description": `Parking reservation from ${startDate} to ${endDate}`
          }]
        };

        const [booking] = await db.query(
          `INSERT INTO DonDatCho (id_nguoi_dung, id_bai_do, vi_tri, loai_xe, thoi_gian_bat_dau, thoi_gian_ket_thuc, thoi_gian_thue, tong_tien, phuong_thuc_thanh_toan, trang_thai)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id_nguoi_dung,
            parkingLotId,
            positions.join(','),
            vehicleType,
            new Date(startDate),
            new Date(endDate),
            duration,
            total,
            paymentMethod,
            'Pending'
          ]
        );

        paypal.payment.create(create_payment_json, (error, payment) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi khi tạo thanh toán PayPal', error: error.message });
          }
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === 'approval_url') {
              return res.json({
                approval_url: `${payment.links[i].href}&bookingId=${booking.insertId}&paymentId=${payment.id}`,
                message: 'Vui lòng hoàn tất thanh toán trên PayPal'
              });
            }
          }
        });
      } else { // Tiền mặt
        const [booking] = await db.query(
          `INSERT INTO DonDatCho (id_nguoi_dung, id_bai_do, vi_tri, loai_xe, thoi_gian_bat_dau, thoi_gian_ket_thuc, thoi_gian_thue, tong_tien, phuong_thuc_thanh_toan, ma_qr, trang_thai)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id_nguoi_dung,
            parkingLotId,
            positions.join(','),
            vehicleType,
            new Date(startDate),
            new Date(endDate),
            duration,
            total,
            paymentMethod,
            qrCode || `QR_${Date.now()}`,
            'Pending'
          ]
        );

        res.status(201).json({ message: 'Tạo đơn đặt chỗ thành công', id_don: booking.insertId });
      }
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo đơn', error: error.message });
    }
  },

  async getAllBookings(req, res) {
    try {
      const bookings = await bookingModel.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn đặt chỗ', error: error.message });
    }
  },

  async updateBooking(req, res) {
    const { id } = req.params;
    const {
      startDate,
      endDate,
      duration,
      status,
      positions,
      total,
      paymentMethod,
      qrCode
    } = req.body;

    try {
      const updateData = {
        thoi_gian_bat_dau: startDate ? new Date(startDate) : undefined,
        thoi_gian_ket_thuc: endDate ? new Date(endDate) : undefined,
        thoi_gian_thue: duration,
        trang_thai: status,
        vi_tri: positions ? positions.join(',') : undefined,
        tong_tien: total,
        phuong_thuc_thanh_toan: paymentMethod,
        ma_qr: qrCode
      };

      await bookingModel.updateBooking(id, updateData);
      res.json({ message: 'Cập nhật đơn đặt chỗ thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật đơn đặt chỗ', error: error.message });
    }
  },

  async deleteBooking(req, res) {
    const { id } = req.params;
    try {
      await bookingModel.deleteBooking(id);
      res.json({ message: 'Xóa đơn đặt chỗ thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa đơn đặt chỗ', error: error.message });
    }
  },

  async handlePaypalSuccess(req, res) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const bookingId = req.query.bookingId;

    if (!payerId || !paymentId || !bookingId) {
      return res.status(400).json({ message: 'Thiếu thông tin thanh toán' });
    }

    try {
      // Lấy thông tin đơn đặt chỗ
      const [bookings] = await db.query('SELECT * FROM DonDatCho WHERE id_don = ?', [bookingId]);
      if (bookings.length === 0) {
        return res.status(404).json({ message: 'Đơn đặt chỗ không tồn tại' });
      }

      const booking = bookings[0];
      const total = booking.tong_tien;

      const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
          "amount": {
            "currency": "USD",
            "total": (total / 23000).toFixed(2)
          }
        }]
      };

      paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
          console.error(error);
          await db.query('UPDATE DonDatCho SET trang_thai = ? WHERE id_don = ?', ['Failed', bookingId]);
          return res.status(500).json({ message: 'Thanh toán thất bại', error: error.message });
        }

        // Cập nhật trạng thái và tạo mã QR
        const qrCode = `QR_${paymentId}_${Date.now()}`;
        await db.query(
          `UPDATE DonDatCho SET trang_thai = ?, ma_qr = ? WHERE id_don = ?`,
          ['Confirmed', qrCode, bookingId]
        );

        // Lưu lịch sử thanh toán 
        await db.query(
          `INSERT INTO LichSuThanhToan (id_don, so_tien, phuong_thuc, ma_giao_dich_momo, trang_thai, ngay_giao_dich)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [bookingId, total, 'Paypal', paymentId, 'Success', new Date()]
        );

        res.redirect(`http://localhost:3000/parking-selection?status=success&qrCode=${qrCode}&expires=${Date.now() + 900000}`);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi xử lý thanh toán', error: error.message });
    }
  },

  async handlePaypalCancel(req, res) {
    const bookingId = req.query.bookingId;

    if (bookingId) {
      try {
        await db.query('UPDATE DonDatCho SET trang_thai = ? WHERE id_don = ?', ['Cancelled', bookingId]);
      } catch (error) {
        console.error(error);
      }
    }

    res.redirect('http://localhost:3000/parking-selection?status=cancelled');
  }
};

module.exports = bookingController;