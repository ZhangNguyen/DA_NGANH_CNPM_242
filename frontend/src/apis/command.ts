import axios from '@/apis/axios'

export const apiWatering = (deviceId: number, value: number) => axios({
    url: `/api/watering/${deviceId}`,
    method: 'POST',
    data: value
})

export const apiRGB = (deviceId: number, value: number) => axios({
    url: `/api/watering/${deviceId}`,
    method: 'POST',
    data: value
})

export const apiPower = (deviceId: number, value: number) => axios({
    url: `/api/watering/${deviceId}`,
    method: 'POST',
    data: value
})

export const apiLight = (deviceId: number, value: number) => axios({
    url: `/api/watering/${deviceId}`,
    method: 'POST',
    data: value
})

export const apiFan = (deviceId: number, value: number) => axios({
    url: `/api/watering/${deviceId}`,
    method: 'POST',
    data: value
})