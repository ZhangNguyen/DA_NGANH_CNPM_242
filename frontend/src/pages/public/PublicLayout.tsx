import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Outlet } from 'react-router-dom'
import { useUserStore } from '@/store/useUserStore'

const PublicLayout = () => {
  const { isAuthenticating } = useUserStore()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-grow">
        {/* Sidebar - only shown when authenticated and on medium+ screens */}
        {isAuthenticating && (
          <aside className="hidden md:block w-64 bg-white border-r border-gray-200 shadow-sm">
            <Sidebar />
          </aside>
        )}
        
        {/* Main content area - adjusts width based on sidebar presence */}
        <main className={`flex-grow ${isAuthenticating ? 'md:ml-0' : ''}`}>
          <div className="p-5 w-full max-w-[1140px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default PublicLayout