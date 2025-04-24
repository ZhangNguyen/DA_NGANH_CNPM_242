// socket.ts
import { Server } from "socket.io";
import { FRONTEND_URL } from "./envConfig";
import { Socket } from "dgram";
const jwt = require('jsonwebtoken');
let io: Server;

export function initSocket(server: any) {
//   io = new Server(server, {
//     cors: {
//       origin: FRONTEND_URL, // tùy chỉnh domain frontend
//       methods: ["GET", "POST"]
//     }
//   });
  io = new Server(server);
  io.use((socket,next) =>
{
    const token = socket.handshake.auth.token;
    if(!token)
    {
        return next(new Error("Authentication error: No token provided"));
    }
    jwt.verify(token, process.env.ACCESS_TOKEN as string, (err: any, decoded: any) => {
        if (err) return next(new Error("Authentication error: Invalid token"));
        socket.data.userId = decoded.id;
        next();
      });
})
  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log("🟢 User connected:", socket.id);

    // Nhận userId để join room riêng
    socket.on("join-room", (token: string) => {
      socket.join(userId);
      console.log(`👤 Socket ${socket.id} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
}
export { io };

