import axios from 'axios';
import {
    requestInterceptor,
    requestErrorInterceptor,
    responseInterceptor,
    responseErrorInterceptor,
    setAxiosClientRef
} from './interceptors';

// Fallback URL if env is not defined
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7192/api/';

const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 0 // 15 seconds timeout
});

// Save the reference to the axios client to avoid circular dependencies
setAxiosClientRef(axiosClient);

// Register request interceptors
axiosClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

// Register response interceptors
axiosClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default axiosClient;
