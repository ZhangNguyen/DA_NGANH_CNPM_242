import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
import { LayoutDashboard } from 'lucide-react'
import { SidebarIcons } from '../../lib/icons'
import { Link } from "react-router-dom"

const Sidebar = () => {
  return (
    
        <Command className="bg-secondary rounded-none">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList className="">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem>
                        <Link to='/' className="flex items-center">
                            <SidebarIcons.House size={70} className="mr-2 text-xl}"/>
                            <span className="font-semibold pl-5">Home</span>
                        </Link>
                    </CommandItem>
                    <CommandItem>
                        <Link to='dashboard' className="flex items-center">
                            <SidebarIcons.LayoutDashboard className="mr-2 text-xl"/>
                            <span className="font-semibold pl-5">Dashboard</span>
                        </Link>
                    </CommandItem>
                    <CommandItem>
                        <Link to='statistics' className="flex items-center">
                            <SidebarIcons.ChartColumn className="mr-2 text-xl"/>
                            <span className="font-semibold pl-5">Statistics</span>
                        </Link>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem>
                        <Link to='/user' className="flex items-center">
                            <SidebarIcons.UserRoundCog className="mr-2 text-xl"/>
                            <span className="font-semibold pl-5">Profile</span>
                        </Link>
                    </CommandItem>
                    <CommandItem>
                        <Link to='/device_control' className="flex items-center">
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