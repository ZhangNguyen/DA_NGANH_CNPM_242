import axios from './axios'

export const apiGetSensorData = () => axios({
    url: '/api/sensors/',
    method: 'GET'
})

export const apiGetSensorDataById = (id: string) => axios({
    url: `/api/sensors/${id}`,
    method: 'GET'
})

// type = {temperature, humidity, light, soil}
export const apiGetSensorDataByDay = (type: string) => axios({
    url: `/api/sensors/day/${type}`,
    method: 'GET'
})

export const apiGetSensorDataByMonth = (type: string) => axios({
    url: `/api/sensors/month/${type}`,
    method: 'GET'
})
