//file 1
import { io } from "socket.io-client";
import { useUserStore } from '@/store/useUserStore';

// wss://1391-2001-ee0-5214-8b50-9018-5733-4618-fff2.ngrok-free.app
const SOCKET_URL = "wss://7d21-2001-ee0-5217-e0c0-b004-680d-62c9-36a6.ngrok-free.app"

export const socket = io(SOCKET_URL,{
  auth: {
    token: useUserStore.getState().accessToken 
  },
  transports: ['websocket']
});
