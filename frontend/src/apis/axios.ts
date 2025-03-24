import axios from 'axios';
//import { useUserStore } from '@/store/useUserStore'
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
})

// tượng trưng cho 1 request gửi lên backend
instance.interceptors.request.use((config) => {
    // take token from local storage
    const store = localStorage.getItem('user-store');
    if (store) {
        const parsedStore = JSON.parse(store);
        if(parsedStore && parsedStore.state?.token) {
            config.headers.Authorization = `Bearer ${parsedStore.state.token}`;
        }
    }
    return config;
})

// tượng trưng cho 1 response trả về từ backend
instance.interceptors.response.use((response) => response)

export default instance;

//======================================================================================= 
export const endPoints = {
    // viết để sẵn cho các endpoints
}