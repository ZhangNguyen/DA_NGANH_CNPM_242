import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { LucideIcon } from 'lucide-react'
import { cn } from "@/lib/utils" 

interface DashboardCardProps {
  title: string;
  data: number;
  icon: React.ReactElement<LucideIcon>;
  className?: string;
}

const DashboardCard = (
  {title, data, className, icon}: DashboardCardProps,
) => {
  
  return (
    <Card className={cn(
      "bg-slate-100 dark:bg-slate-800 p-4 pb-0 w-full h-full",
      className
    )}>
      <CardContent>
        <h3 className="lg:text-3xl text-center mb-4 font-bold text-slate-500 dark:text-slate-200">
          {title}
        </h3>
        <div className="flex gap-5 justify-center items-center mb-4">
         {icon}
          <h3 className="lg:text-5xl font-semibold text-slate-500 dark:text-slate-200">
            {data}
          </h3>
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardCard