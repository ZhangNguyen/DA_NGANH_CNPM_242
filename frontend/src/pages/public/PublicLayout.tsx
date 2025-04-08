import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <>
      <Header/>
      <div className='flex'>
        <div className='hidden md:block h-[100vh] w-1/6'>
          <Sidebar/>
        </div>
        <div className='p-5 w-full md:max-w-[1140px] mx-auto'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default PublicLayout