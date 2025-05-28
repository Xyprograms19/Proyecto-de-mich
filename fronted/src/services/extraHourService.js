
import axios from 'axios';
import authHeader from './authService'; 

const API_URL = 'https://localhost:7025/api/ExtraHours/'; 

const getExtraHours = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getExtraHourById = (id) => {
  return axios.get(API_URL + id, { headers: authHeader() });
};

const createExtraHour = (extraHour) => {
  return axios.post(API_URL, extraHour, { headers: authHeader() });
};

const updateExtraHour = (id, extraHour) => {
  return axios.put(API_URL + id, extraHour, { headers: authHeader() });
};

const deleteExtraHour = (id) => {
  return axios.delete(API_URL + id, { headers: authHeader() });
};

const extraHourService = {
  getExtraHours,
  getExtraHourById,
  createExtraHour,
  updateExtraHour,
  deleteExtraHour,
};

export default extraHourService;