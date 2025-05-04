import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
  } from "@/components/ui/command"
import { SidebarIcons } from '@/lib/icons'
import { Link } from "react-router-dom"

const Sidebar = () => {
  return (
        <Command className="bg-gray-300 h-full rounded-none">
            <CommandList className="h-full" >
                <CommandGroup heading="Main features" >
                    <CommandItem className="text-lg">
                        <Link to='/' className="flex items-center">
                            <SidebarIcons.House className="mr-2 text-xl}"/>
                            <span className="font-semibold pl-5">Home</span>
                        </Link>
                    </CommandItem>
                    <CommandItem className="text-lg">
                        <Link to='dashboard' className="flex items-center">
                            <SidebarIcons.LayoutDashboard className="mr-2 text-xl"/>
                            <span className="font-semibold pl-5">Dashboard</span>
                        </Link>
                    </CommandItem>
                    <CommandItem className="text-lg">
                        <Link to='command-history' className="flex items-center">
                            <SidebarIcons.ChartColumn className="mr-2 text-xl"/>
                            <span className="font-semibold pl-5">Command History</span>
                        </Link>
                    </CommandItem>
                    <CommandItem className="text-lg">
                        <Link to='manage-plant' className="flex items-center">
                            <SidebarIcons.TreePalm className="mr-2 text-xl"/>
                            <span className="font-semibold pl-5">Manage plants</span>
                        </Link>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    {/* <CommandItem className="text-lg">
                        <Link to='/user' className="flex items-center">
                            <SidebarIcons.UserRoundCog className="mr-2 text-xl"/>
                            <span className="font-semibold pl-5">Profile</span>
                        </Link>
                    </CommandItem> */}
                    <CommandItem className="text-xl">
                        <Link to='/device-control' className="flex items-center">
                            <SidebarIcons.SlidersHorizontal className="mr-2 text-xl"/>
                            <span className="font-semibold pl-5">Device control</span>
                        </Link>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    
  )
}

export default Sidebar