import { DashboardCard } from "../../components"
import { DashboardIcons } from '../../lib/icons'
import { 
  apiGetSensorData, 
  apiGetSensorDataById, 
  apiGetSensorDataByDay, 
  apiGetSensorDataByMonth } 
from '@/apis/sensor'
import { apiLoginAdafruit, apiGetAdafruitInfo } from "@/apis/adfruit"
import { useEffect, useState } from "react"
import { useUserStore } from "@/store/useUserStore"

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
    const sensorId = '67e3bae9e5a0721202a29e06';
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
    getSensorByMonth(SensorType.Humidity)
    getSensorByMonth(SensorType.Soil)
    getSensorByMonth(SensorType.Light)
    // getSensorData()
    // getAdafruitInfo()
    // getSensorDataById()
  },[])
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-4">
      <DashboardCard 
        title="Weather" 
        data={15} 
        icon={<DashboardIcons.Droplet/>} 
        className="p-4 w-full rounded-xl col-span-1"
      />
      
      <div className="col-span-2 grid grid-rows-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard 
            title="Humidity" 
            data={10} 
            icon={<DashboardIcons.Droplet/>}
            className="p-4 w-full rounded-xl"
          />
          <DashboardCard 
            title="Temperature" 
            data={5} 
            icon={<DashboardIcons.Thermometer/>} 
            className="p-4 w-full rounded-xl"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard 
            title="Soil" 
            data={15} 
            icon={<DashboardIcons.Droplet/>} 
            className="p-4 w-full rounded-xl"
          />
          <DashboardCard 
            title="Light" 
            data={10} 
            icon={<DashboardIcons.Droplet/>}
            className="p-4 w-full rounded-xl"
          />
        </div>
      </div>
    </div>
  )
}

export default DashBoard