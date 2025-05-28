
import axios from 'axios';
import authService from './authService'; 



const API_URL = 'https://localhost:7025/api/ExtraHourTypes/'; 


const getAuthHeader = () => {
  const token = authService.getToken(); 
  if (token) {
    return { Authorization: 'Bearer ' + token };
  } else {
    return {}; 
  }
};

const getExtraHourTypes = () => {
  return axios.get(API_URL, { headers: getAuthHeader() }); 
};

const getExtraHourTypeById = (id) => {
  return axios.get(API_URL + id, { headers: getAuthHeader() }); 
};

const createExtraHourType = (typeData) => {
  return axios.post(API_URL, typeData, { headers: getAuthHeader() }); 
};

const updateExtraHourType = (id, typeData) => {
  return axios.put(API_URL + id, typeData, { headers: getAuthHeader() }); 
};

const deleteExtraHourType = (id) => {
  return axios.delete(API_URL + id, { headers: getAuthHeader() }); 
};

const extraHourTypeService = {
  getExtraHourTypes,
  getExtraHourTypeById,
  createExtraHourType,
  updateExtraHourType,
  deleteExtraHourType,
};

export default extraHourTypeService;