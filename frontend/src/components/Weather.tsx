import { Search, Wind, Waves, NavigationOff, CloudFog, Wheat  } from 'lucide-react';
import clear_png from '@/assets/clear.png'
import cloud_png from '@/assets/cloud.png'
import drizzle_png from '@/assets/drizzle.png'
import humidity_png from '@/assets/humidity.png'
import rain_png from '@/assets/rain.png'
import snow_png from '@/assets/snow.png'
import wind_png from '@/assets/wind.png'
import { apiGetWeather } from '@/apis/app'
import { useEffect } from 'react';
import { useState } from 'react';

// type weatherData = {
//   humidity: number,
//   windspeed: number,
//   tempratute: number,
// }

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    humidity: 0,
    windSpeed: 0,
    temperature: 0,
    location: null,
    weatherIcon: clear_png
  });
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
    try {
      const response = await apiGetWeather(cityName)
      if (response) {
        console.log(response.data)
        const icon = allIcons[response.data.weather[0].icon] || clear_png
        setWeatherData({
          humidity: response.data.main.humidity || 0,
          windSpeed: response.data.wind.speed || 0,
          temperature: response.data.main.temp || 0,
          location:  response.data.name || 0,
          weatherIcon: icon
        })
      }
      else console.log('API failed')
    } catch (error) {

    }
  } 
  useEffect(() => { 
    //search("Ho Chi Minh")
  }, [])
  return (
    <div className='flex flex-col items-center h-full border rounded-xl place-self-center p-10 border-2 bg-linear-45 from-slate-300 to-gray-400'>
      {/* search bar */}
      <div className='flex h-10 items-center gap-2'>
        <input  type="text" 
                placeholder='Search' 
                className='outline-0 h-full rounded-2xl pl-6 bg-[#ebfffc]'/>
        <div className='rounded-full w-full p-2 bg-[#ebfffc] cursor-pointer'>
          <Search color='gray'/>
        </div>
        
      </div>
      {/* Location Temp and Weather Icon */}
      <img src={weatherData.weatherIcon} alt="" className='w-[150px] m-[30px]'/>
      <p className='text-[60px]/15'>{weatherData.temperature}℃</p>
      <p className='text-[30px]'>{weatherData.location}</p>
      {/* Weather Data */}
      <div className='flex justify-between w-[100%] mt-[40px] m-2'>
        <div className='flex flex-row gap-[12px]'>
          <div>
            <Waves size={35}/>
          </div>
          <div>
            <p>{weatherData.humidity}%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className='flex flex-row gap-[12px]'>
          <div>
            <Wind size={35}/>
          </div>
          <div>
            <p>{weatherData.windSpeed} Km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather