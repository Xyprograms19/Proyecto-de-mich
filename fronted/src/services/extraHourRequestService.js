
import axios from 'axios';
import authService from './authService'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5023/api';
const API_URL = `${API_BASE_URL}/ExtraHourRequests/`;

const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: 'Bearer ' + token } : {};
};

const getRecentExtraHourRequests = (count = 5) => {
  return axios.get(`${API_URL}Recent?count=${count}`, { headers: getAuthHeader() });
};

const getPendingExtraHourRequestsCount = () => {
  return axios.get(`${API_URL}PendingCount`, { headers: getAuthHeader() });
};


const extraHourRequestService = {
  getRecentExtraHourRequests,
  getPendingExtraHourRequestsCount,
};

export default extraHourRequestService;