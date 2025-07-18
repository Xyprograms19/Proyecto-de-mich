// src/services/axios.js
// src/services/axios.js
// src/services/axios.js
import axios from 'axios';
import { authHeader } from '../services/authService';

const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    const headers = authHeader();
    config.headers = {
      ...config.headers,
      ...headers,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
