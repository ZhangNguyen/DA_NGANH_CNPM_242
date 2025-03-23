import { DashboardCard } from "../../components"
import { DashboardIcons } from '../../lib/icons'

const DashBoard = () => {
  return (
    <div className="grid grid-rows-3 grid-flow-col gap-4 px-4 py-4 leading-10 border-4 h-screen-100dvh">
      <DashboardCard 
        title="Total Products" 
        data={15} 
        icon={<DashboardIcons.Droplet/>} 
        className="p-4 w-ful rounded-xl row-span-3"
      />
      <DashboardCard 
        title="Total Users" 
        data={10} 
        icon={<DashboardIcons.Droplet/>}
        //className="p-4 w-ful rounded-xl col-span-2"
      />
      <DashboardCard 
        title="Total Orders" 
        data={5} 
        icon={<DashboardIcons.Droplet/>} 
        //className="p-4 w-ful rounded-xl row-span-3"
      />
      <DashboardCard 
        title="Total Products" 
        data={15} 
        icon={<DashboardIcons.Droplet/>} 
        //className="p-4 w-full rounded-xl row-span-2 col-span-2"
      />
  </div>
  )
}

export default DashBoard