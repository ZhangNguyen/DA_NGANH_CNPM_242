import axios from "./axios"

export const apiGetAllDedicatedDevice = () => axios({
    url: '/api/dedicated',
    method: 'GET'
})

export const apiGetDedicatedDeviceByID = (deviceID: number) => axios({
    url: `/api/dedicated/${deviceID}`,
    method: 'Get'
})