import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
})

// tượng trưng cho 1 request gửi lên backend
instance.interceptors.request.use((config) => config)

// tượng trưng cho 1 response trả về từ backend
instance.interceptors.response.use((response) => response)

export default instance;

export const endPoints = {
    // viết để sẵn cho các endpoints
}