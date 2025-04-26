import axios from "./axios"

// DEDICATED DEVICES ---------------------------------------------------------------------------------
export const apiGetAllDedicatedDevice = () => axios({
    url: '/api/dedicated',
    method: 'GET',
})

export const apiGetDedicatedDeviceByID = (deviceID: number) => axios({
    url: `/api/dedicated/${deviceID}`,
    method: 'GET'
})
// ---------------------------------------------------------------------------------------------------

// SHARED DEVICE -------------------------------------------------------------------------------------
export const apiGetAllSharedDevice = () => axios({
    url: '/api/shared',
    method: 'GET'
})

export const apiGetSharedDeviceByID = (deviceID: number) => axios({
    url: `/api/shared/${deviceID}`,
    method: 'GET'
})
// --------------------------------------------------------------------------------------------------