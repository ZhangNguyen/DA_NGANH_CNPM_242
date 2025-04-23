import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useUserStore } from "@/store/useUserStore";
import { socket } from '@/apis/socket'

function App() {
    // Yêu cầu đúng các đoạn sau
socket.on("connect", () => {
  console.log("Connected to socket:", socket.id);
//Tham gia vào room user_id
  socket.emit("join-room", useUserStore.getState().accessToken);
});

  return (
    <main>
       <Toaster />
      <Outlet />
    </main>
    
  )
}

export default App
