const express = require("express");
const cors = require("cors");

const app = express();

// Cấu hình CORS chỉ cho phép frontend (http://localhost:3000) gọi API
app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());

// Chạy server tại cổng 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server chạy tại http://localhost:${PORT}`));
