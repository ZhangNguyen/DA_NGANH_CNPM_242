import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <main>
       <Toaster />
      <Outlet />
    </main>
  )
}

export default App
