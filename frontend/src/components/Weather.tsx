import { Search, Wind, Waves  } from 'lucide-react';
import clear_png from '@/assets/clear.png'
import cloud_png from '@/assets/cloud.png'
import drizzle_png from '@/assets/drizzle.png'
import humidity_png from '@/assets/humidity.png'
import rain_png from '@/assets/rain.png'
import snow_png from '@/assets/snow.png'
import wind_png from '@/assets/wind.png'



const Weather = () => {
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
      <img src={clear_png} alt="" className='w-[150px] m-[30px]'/>
      <p className='text-[80px]/15'>16℃</p>
      <p className='text-[40px]'>Viet Nam</p>
      {/* Weather Data */}
      <div className='flex justify-between w-[100%] mt-[40px] m-2'>
        <div className='flex flex-row gap-[12px]'>
          <div>
            <Waves size={35}/>
          </div>
          
          <div>
            <p>91%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className='flex flex-row gap-[12px]'>
          <div>
            <Wind size={35}/>
          </div>
          <div>
            <p>3.6 Km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather