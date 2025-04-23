//file 1
import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL
export const socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem("accessToken") // hoặc nơi bạn lưu JWT
  },
  transports: ['websocket']
});
