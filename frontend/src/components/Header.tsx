import { Link } from "react-router-dom"
import logo from '@/assets/reshot-icon-smart-farm-9R8XDL437Q.svg'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserStore } from '@/store/useUserStore'
import { useEffect } from "react"

const Header = () => {
  const { signOut, setUser, isAuthenticating } = useUserStore() 
  
  useEffect(() => {
    setUser()
  }, [])   

  return (
    <div className='bg-primary dark:bg-slate-700 text-white py-2 px-5 flex justify-between'>  
      <Link to='/' className="flex flex-row items-center space-x-4"> 
        <img src={logo} alt='SmartFarm' width={40} className="bg-emerald-50 rounded-md"/>
        <span className="text-lg text-emerald-50 text-bold">Smart Farm</span>
      </Link>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="text-black">BT</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {isAuthenticating ? (
              <>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>
                  <Link to='/login'>Log in</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to='/register'>Register</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Header
