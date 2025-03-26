import { Login, Register } from '@/pages/public'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <>
        <div className='flex w-screen h-screen justify-center py-30'>
            <div className='flex rounded-lg shadow-lg'>
            <Outlet />
            </div>
        </div>
    </>
  )
}

export default AuthLayout