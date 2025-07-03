import axios from 'axios';

const api = axios.create({
  // Asegurate del slash final para no tener que preocuparte por "/" al llamar:
  baseURL: 'http://localhost:8080/auth/',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;