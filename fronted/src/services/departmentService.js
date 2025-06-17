
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5023/api';
const API_URL = `${API_BASE_URL}/departments`;

const getDepartments = () => axios.get(API_URL);

const createDepartment = (department) => axios.post(API_URL, department);

const updateDepartment = (id, department) => axios.put(`${API_URL}/${id}`, department);

const deleteDepartment = (id) => axios.delete(`${API_URL}/${id}`);

export default {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
