import { DashboardCard, Weather } from "../../components"
import { DashboardIcons } from '../../lib/icons'
import { 
  apiGetSensorData, 
  apiGetSensorDataById, 
  apiGetSensorDataByDay, 
  apiGetSensorDataByMonth } 
from '@/apis/sensor'
import { useEffect, useState } from "react"

const DashBoard = () => {
  // const userStore = useUserStore((state) => { state.accessToken })\
  // const getSensorData = async () => {
  //   const response = await apiGetSensorData()
  // }
  // const adfruit_data = {
  //   adafruit_username: import.meta.env.VITE_ADAFRUIT_USERNAME,
  //   adafruit_key: import.meta.env.VITE_ADAFRUIT_KEY
  // }
  // const loginAdafruit = async () => {
  //   const response = await apiLoginAdafruit(adfruit_data)
  // }
  // const getAdafruitInfo = async () => {
  //   const response = await apiGetAdafruitInfo()
  // }
  // const getSensorDataById = async () => {
  //   const sensorId = '67e3bae9e5a0721202a29e06';
  //   const response = await apiGetSensorDataById(sensorId)
  // }
  enum SensorType {
    Light = 'light',
    Temperature = 'temperature',
    Humidity = 'humidity',
    Soil = 'soil'
  }
  const getSesnorByDay = async (sensorType: SensorType) => {
    const response = await apiGetSensorDataByDay(sensorType)
    
  } 
  const getSensorByMonth = async (sensorType: SensorType) => {
    const response = await apiGetSensorDataByMonth(sensorType)
    if (sensorType === SensorType.Temperature) {
      getTemprature(Math.round(response.data.average * 100) / 100)
    }
    if (sensorType === SensorType.Humidity) {
      getHumidity(Math.round(response.data.average * 100) / 100)
    }
    if (sensorType === SensorType.Soil) {
      getSoil(Math.round(response.data.average * 100) / 100)
    }
    if (sensorType === SensorType.Light) {
      getLight(Math.round(response.data.average * 100) / 100)
    }
    
  }
  const [ temperature, getTemprature ] = useState<number>(0)
  const [ humidity, getHumidity ] = useState<number>(0)
  const [ soil, getSoil ] = useState<number>(0)
  const [ light, getLight ] = useState<number>(0)
  useEffect(() => {
    getSensorByMonth(SensorType.Temperature)
    getSensorByMonth(SensorType.Humidity)
    getSensorByMonth(SensorType.Soil)
    getSensorByMonth(SensorType.Light)
  },[])
  return (
    <div className="grid grid-cols-3 gap-4 px-4 py-4">
      <Weather/>
      
      <div className="col-span-2 grid grid-rows-2 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard 
            title="Humidity" 
            data={humidity} 
            icon={<DashboardIcons.Droplet size={40}/>}
            className="p-4 w-full rounded-xl"
          />
          <DashboardCard 
            title="Temperature" 
            data={temperature} 
            icon={<DashboardIcons.Thermometer size={40}/>} 
            className="p-4 w-full rounded-xl"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard 
            title="Soil" 
            data={soil} 
            icon={<DashboardIcons.Sprout size={40}/>} 
            className="p-4 w-full rounded-xl"
          />
          <DashboardCard 
            title="Light" 
            data={light} 
            icon={<DashboardIcons.Sun size={40}/>}
            className="p-4 w-full rounded-xl"
          />
        </div>
      </div>
    </div>
  )
}

export default DashBoard