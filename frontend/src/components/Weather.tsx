import { Search, Wind, Waves} from 'lucide-react';
import clear_png from '@/assets/clear.png'
import cloud_png from '@/assets/cloud.png'
import drizzle_png from '@/assets/drizzle.png'
import rain_png from '@/assets/rain.png'
import snow_png from '@/assets/snow.png'
import { apiGetWeather } from '@/apis/app'
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface weatherDataProps {
  name: string;
  main: {
    temp: number;
    humidity: number;
  }
  wind: {
    speed: number;
  }
  weather: {
    icon: string
    main: string
  } []
}
const Weather = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [weatherData, setWeatherData] = useState<weatherDataProps | null>(null);
  const allIcons = {
    '01d': clear_png,
    '01n': clear_png,
    '02d': cloud_png,
    '02n': cloud_png,
    '03d': cloud_png,
    '03n': cloud_png,
    '04d': drizzle_png,
    '04n': drizzle_png,
    '09d': rain_png,
    '09n': rain_png,
    '10d': rain_png,
    '10n': rain_png,
    '13d': snow_png,
    '13n': snow_png,
  }
  const search = async (cityName: string) => {
    if (cityName == '') {
      toast.error('Please enter a city name')
      return
    }
    try {
      const response = await apiGetWeather(cityName)
      if (response) {
        setWeatherData(response.data)
        toast.success(`Get ${response.data.name} current weather`)
      }
      else {
        toast.error('api wrong')
      }
    } catch (error) {
      toast.error('City not found!')
    }
  } 
  const icon = allIcons[weatherData?.weather[0]?.icon as keyof typeof allIcons ?? '01d']
  // useEffect(() => { 
  //   //search("Ho Chi Minh") 
  // }, [])
  return (
    <div className='flex flex-col items-center h-full rounded-xl place-self-center p-10 border-2 bg-linear-45 from-slate-300 to-gray-400'>
      {/* search bar */}
      <div className='flex h-10 items-center gap-2'>
        <input
              ref={inputRef}  
              type="text" 
              placeholder='Search' 
              className='outline-0 h-full rounded-2xl pl-6 bg-[#ebfffc]'/>
        <div className='rounded-full w-full p-2 bg-[#ebfffc] cursor-pointer'>
          <Search color='gray' onClick={() => inputRef.current && search(inputRef.current.value)}/>
        </div>
      </div>
      {/* Location, Tempratuer, Weather Main, and Weather Icon */}
      <img src={icon} alt="" className='w-[150px] m-[30px]'/>
      <p className='text-[60px]/15'>{weatherData?.main.temp}℃</p>
      <p className='text-[25px]'>{weatherData?.weather[0].main}</p>
      <p className='text-[30px]'>{weatherData?.name}</p>
      {/* Weather Data */}
      <div className='flex justify-between w-[100%] mt-[40px] m-2'>
        <div className='flex flex-row gap-[12px]'>
          <div>
            <Waves size={35}/>
          </div>
          <div>
            <p>{weatherData?.main.humidity}%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className='flex flex-row gap-[12px]'>
          <div>
            <Wind size={35}/>
          </div>
          <div>
            <p>{weatherData?.wind.speed} Km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather