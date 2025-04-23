import axios from "./axios"

export const apiGetAllSharedDevice = () => axios({
    url: '/api/shared',
    method: 'GET'
})

export const apiGetSharedDeviceByID = (deviceID: number) => axios({
    url: `/api/shared/${deviceID}`,
    method: 'Get'
})