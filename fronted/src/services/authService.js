
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5023/api';

// const authService = {
//   login: async (usernameOrEmail, password, rememberMe = false) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/Auth/login`, {
//         usernameOrEmail,
//         password,
//         rememberMe,
//       });

//       if (response.data.token) {

//         localStorage.setItem('user', JSON.stringify(response.data)); 
//         return response.data;
//       }
//       return null;
//     } catch (error) {
//       console.error("Error en el login:", error.response?.data || error.message);
//       throw error; 
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('user');
//   },

//   getCurrentUser: () => {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null; 
//   },

//   getToken: () => {
//     const user = authService.getCurrentUser();
//     return user ? user.token : null;
//   }
// };

// export default authService;

import axios from '../services/axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5023/api';
console.log("API_BASE_URL:", API_BASE_URL);

const authService = {
  login: async (usernameOrEmail, password, rememberMe = false) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Auth/login`, {
        usernameOrEmail,
        password,
        rememberMe,
      });

      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error en el login:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    const user = authService.getCurrentUser();
    return user ? user.token : null;
  }
};

// ✅ Añade esta función afuera del objeto
const authHeader = () => {
  const token = authService.getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};

export { authHeader };
export default authService;

