import express, { Request, Response } from "express";
import './types/index';
import dotenv from "dotenv";
import routes from "./routes/index";
import { connectDB } from "./config/db";
import {FRONTEND_URL, PORT} from "./config/envConfig";
import http from 'http';
import { Server } from "socket.io";
import { initSocket } from "./config/socket";
let cors = require('cors');
const bodyParser = require("body-parser");
// Khởi tạo ứng dụng express
const app = express();

// Load biến môi trường từ file .env
dotenv.config();

// Sử dụng middleware để parse JSON từ request
app.use(bodyParser.json());

// Cấu hình CORS để cho phép frontend truy cập backend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Cho phép xử lý preflight request với phương thức OPTIONS
app.options("*", cors());

// Định tuyến API
routes(app);

// Tạo HTTP server để gắn thêm socket.io
const server = http.createServer(app);

// Khởi tạo socket.io và thiết lập các sự kiện real-time
initSocket(server);

// Kết nối MongoDB hoặc database tùy chỉnh
connectDB();

// Lắng nghe server tại cổng cấu hình
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});