import axios from './axios'

export const apiSignUp = (data: any) => {  
    axios({
        url: '/auth/signup',
        method: 'POST',
        data
    })
}
export const apiSignIn = (data: any) => {
    axios({
        url: '/auth/signin',
        method: 'POST',
        data
    })
}
