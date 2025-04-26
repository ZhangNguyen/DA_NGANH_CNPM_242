//file 1
import { io } from "socket.io-client";
import { useUserStore } from '@/store/useUserStore';

// wss://1391-2001-ee0-5214-8b50-9018-5733-4618-fff2.ngrok-free.app
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL

export const socket = io(SOCKET_URL,{
  auth: {
    token: useUserStore.getState().accessToken 
  },
  withCredentials: true,
  transports: ['websocket']
});
