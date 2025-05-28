
import axios from 'axios';
import authService from './authService'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5023/api';
const API_URL = `${API_BASE_URL}/Users/`;

const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: 'Bearer ' + token } : {};
};

const getAllUsers = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getActiveUsersCount = () => {
  return axios.get(`${API_URL}ActiveCount`, { headers: getAuthHeader() });
};


const userService = {
  getAllUsers,
  getActiveUsersCount,
};

export default userService;