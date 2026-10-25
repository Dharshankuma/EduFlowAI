import axios from 'axios';
import {
    requestInterceptor,
    requestErrorInterceptor,
    responseInterceptor,
    responseErrorInterceptor,
    setAxiosClientRef
} from './interceptors';

const rawBaseURL = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7192/api/').trim();
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL : `${rawBaseURL}/`;

const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 0 // 15 seconds timeout
});

// Save the reference to the axios client to avoid circular dependencies
setAxiosClientRef(axiosClient);

// Register request interceptors
axiosClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

// Register response interceptors
axiosClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default axiosClient;
