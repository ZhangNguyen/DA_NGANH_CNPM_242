import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Newspaper } from "lucide-react";
import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string;
  data: number;
  icon: React.ReactElement<LucideIcon>;
}

const DashboardCard = ({ title, data, icon}: DashboardCardProps) => {
  return (
    <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0">
      <CardContent>
        <h3 className="text-3xl text-center mb-4 font-bold text-slate-500 dark:text-slate-200">
          {title}
        </h3>
        <div className="flex gap-5 justify-center items-center mb-4">
          {icon}
          <h3 className="text-5xl font-semibold text-slate-500 dark:text-slate-200">
            {data}
          </h3>
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardCard