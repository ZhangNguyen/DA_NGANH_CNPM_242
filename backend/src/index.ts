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
const app = express();
dotenv.config();
app.use(bodyParser.json());
//Dùng cors để cho phép frontend truy cập vào backend
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
// }));
app.use(cors({
  origin: "http://localhost:5173", // hoặc lấy từ FRONTEND_URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Cho phép xử lý preflight OPTIONS
app.options("*", cors());

routes(app);
const server = http.createServer(app)
initSocket(server);

connectDB();
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
