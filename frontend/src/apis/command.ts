import axios from '@/apis/axios'

export const apiWatering = (deviceId: number, value: number) => axios({
    url: `/api/command/watering/${deviceId}`,
    method: 'POST',
    data: { value }
})

export const apiRGB = (deviceId: number, value: number) => axios({
    url: `/api/command/RGB/${deviceId}`,
    method: 'POST',
    data: { value }
})

export const apiPower = (deviceId: number, value: number) => axios({
    url: `/api/command/power/${deviceId}`,
    method: 'POST',
    data: { value }
})

export const apiLight = (deviceId: number, value: number) => axios({
    url: `/api/command/light/${deviceId}`,
    method: 'POST',
    data: { value }
})

export const apiFan = (deviceId: number, value: number) => axios({
    url: `/api/command/fan/${deviceId}`,
    method: 'POST',
    data: { value }
})