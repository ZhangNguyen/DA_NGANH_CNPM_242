import axios from "axios"

export const apiGetWeather = (cityName: string) => axios({
    url: `${import.meta.env.VITE_WEATHER_API_URL}?q=${cityName}&appid=${import.meta.env.VITE_WEATHER_APP_ID}&units=metric`,
    method: 'GET'
})