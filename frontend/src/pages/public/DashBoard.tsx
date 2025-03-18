import { DashboardCard } from "../../components"
import { DashboardIcons } from "../../lib/icons"

const DashBoard = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-5 mb-5">
      <DashboardCard 
        title='Air' 
        data={25}
        icon={<DashboardIcons.Thermometer className="text-slate-500" size={72}/>}
      />
      <DashboardCard 
        title='Air' 
        data={25}
        icon={<DashboardIcons.Thermometer className="text-slate-500" size={72}/>}
      />
      <DashboardCard 
        title='Air' 
        data={25}
        icon={<DashboardIcons.Thermometer className="text-slate-500" size={72}/>}
      />
      <DashboardCard 
        title='Air' 
        data={25}
        icon={<DashboardIcons.Thermometer className="text-slate-500" size={72}/>}
      />
      <DashboardCard 
        title='Air' 
        data={25}
        icon={<DashboardIcons.Thermometer className="text-slate-500" size={72}/>}
      />
      
    </div>
  )
}

export default DashBoard