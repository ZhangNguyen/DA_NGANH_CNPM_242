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
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
const server = http.createServer(app)
initSocket(server);
connectDB();
routes(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
