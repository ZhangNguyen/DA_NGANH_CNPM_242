import Header from '@/components/header/Header'
import Sidebar from '@/components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <>
      <Header/>
      <div className='flex'>
        <div className='hidden md:block h-[100vh] w-[300px]'>
          <Sidebar/>
        </div>
        <div className='p-5 w-full md:max-w-[1140px]'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default PublicLayout