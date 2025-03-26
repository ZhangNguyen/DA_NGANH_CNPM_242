import { DashboardCard } from "../../components"
import { DashboardIcons } from '../../lib/icons'
import { 
  apiGetSensorData, 
  apiGetSensorDataById, 
  apiGetSensorDataByDay, 
  apiGetSensorDataByMonth } 
from '@/apis/sensor'
import { apiLoginAdafruit, apiGetAdafruitInfo } from "@/apis/adfruit"
import { useEffect } from "react"
import { useUserStore } from "@/store/useUserStore"
import { get } from "http"

const DashBoard = () => {
  // const userStore = useUserStore((state) => { state.accessToken })\
  const { user } = useUserStore()
  const getSensorData = async () => {
    const response = await apiGetSensorData()
    console.log(response)
  }
  const data = {
    adafruit_username: import.meta.env.VITE_ADAFRUIT_USERNAME,
    adafruit_key: import.meta.env.VITE_ADAFRUIT_KEY
  }
  const loginAdafruit = async () => {
    const response = await apiLoginAdafruit(data)
    console.log(response)
  }
  const getAdafruitInfo = async () => {
    const response = await apiGetAdafruitInfo()
    console.log('User', user)
    console.log('Adaruit info:', response.data)
  }
  const getSensorDataById = async () => {
    const sensorId = '67dedfd4e5a0721202a29c48';
    const response = await apiGetSensorDataById(sensorId)
    console.log(response)
  }
  enum SensorType {
    Light = 'light',
    Temperature = 'temperature',
    Humidity = 'humidity',
    Soil = 'soil'
  }
  const getSesnorByDay = async (sensorType: SensorType) => {
    const response = await apiGetSensorDataByDay(sensorType)
    console.log(response)
  } 
  const getSensorByMonth = async (sensorType: SensorType) => {
    const response = await apiGetSensorDataByMonth(sensorType)
    console.log(response)
  }

  useEffect(() => {
    //loginAdafruit()
    //getSesnorByDay()
    getSensorByMonth(SensorType.Temperature)
    getSensorData()
    getAdafruitInfo()
    getSensorDataById()
  },[])

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