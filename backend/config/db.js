const mysql = require('mysql2/promise');

// Tạo pool kết nối với Promise support
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Minhkhoa1@',
  database: 'QuanLyBaiDauDoXe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
