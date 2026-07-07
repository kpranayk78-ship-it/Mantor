import axios from 'axios';

// Get the base URL from Vite environment variables
// Vite exposes env variables on import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create a new Axios instance with centralized configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can modify the request configuration here before it is sent.
    // E.g., Retrieve a token from local storage and add it to the headers for authentication.
    
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // Logging request for debugging (can be disabled in production)
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    // Handle request errors
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger.
    
    // Logging response for debugging
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response);
    }
    
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger.
    // Centralized error handling
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`[API Error] ${error.response.status} - ${error.config.url}`, error.response.data);
      
      // Global handling of specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized: E.g., redirect to login or refresh token
          console.warn('Unauthorized access - perhaps redirect to login');
          break;
        case 403:
          // Forbidden
          console.warn('Forbidden access');
          break;
        case 404:
          // Not found
          console.warn('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[API Network Error] No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[API Request Setup Error]', error.message);
    }

    // Always reject the promise so that the calling code can handle the error further if needed
    return Promise.reject(error);
  }
);

export default apiClient;
