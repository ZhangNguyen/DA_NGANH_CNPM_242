import axios from './axios'

export const apiGetAdafruitInfo = () => axios({
    url: '/api/users/adafruit-info',
    method: 'GET'
})

export const apiLoginAdafruit = (data: any) => axios({
    url: '/api/users/adafruit-info',
    method: 'POST',
    data
})