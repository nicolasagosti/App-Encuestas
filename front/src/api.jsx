// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Interceptor: añade el token salvo en login/register
api.interceptors.request.use(config => {
  // no tocar /auth/login ni /auth/register
  if (
    config.url?.endsWith('/auth/login') ||
    config.url?.endsWith('/auth/register')
  ) {
    return config;
  }

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
