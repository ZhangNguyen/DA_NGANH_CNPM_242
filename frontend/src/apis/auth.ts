import axios from './axios'
import { useUserStore } from '@/store/useUserStore' 

export const apiSignUp = (data: any) => axios({
    url: '/api/users/sign-up',
    method: 'POST',
    data
})

export const apiSignIn = (data: any) => axios({
    url: '/api/users/sign-in',
    method: 'POST',
    data
})

export const apiGetRefreshToken = () => {
    const refreshToken = useUserStore.getState().refreshToken;
    //console.log(refreshToken)
    return axios({
        url: '/api/users/refresh-token',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
    })
}

export const apiGetUser = () => axios({
    url: '/api/users/getUser',
    method: 'GET',
})

