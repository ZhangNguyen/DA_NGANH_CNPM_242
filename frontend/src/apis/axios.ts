import axios, {
    CreateAxiosDefaults,
    InternalAxiosRequestConfig,
    AxiosError
} from 'axios';
import { apiGetRefreshToken } from './auth';
import { useUserStore } from '@/store/useUserStore'

const baseConfig: CreateAxiosDefaults = {
    baseURL: "http://localhost:3000",
    withCredentials: true
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }

const instance = axios.create(baseConfig);

// tượng trưng cho 1 request gửi lên backend
instance.interceptors.request.use((config) => {
    const accessToken = useUserStore.getState().accessToken;
    if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})

// tượng trưng cho 1 response trả về từ backend
instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: CustomAxiosRequestConfig | undefined = error.config;
        
        if (
            error.response?.status === 401 && 
            originalRequest &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const response = await apiGetRefreshToken();
                if (response.data.status === 'error') {
                    useUserStore.getState().signOut();
                    return;
                }

                useUserStore.setState({
                    accessToken: response.data.access_token,
                });
                originalRequest.headers.Authorization = `Bearer ${useUserStore.getState().accessToken}`;
                return instance(originalRequest);
                        
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 403) {
                    useUserStore.getState().signOut();
                    return;
                }
            }
        }
        return Promise.reject(error);
    }
);

export default instance;

//======================================================================================= 
export const endPoints = {
    // viết để sẵn cho các endpoints
    
}