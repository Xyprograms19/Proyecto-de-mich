
import axios from "axios";

const API_URL = "http://localhost:4000/api/departments"; 

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
