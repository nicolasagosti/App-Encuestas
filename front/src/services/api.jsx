// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor: añade el token salvo en login/register
api.interceptors.request.use(
  (config) => {
    // No tocar /auth/login ni /auth/register
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
  },
  (error) => Promise.reject(error)
);

// Preguntas
export const crearPregunta = (texto) =>
  api.post('/encuestas/preguntas', { texto });

export const obtenerPreguntas = () =>
  api.get('/encuestas/preguntas');

export const eliminarPregunta = (id) =>
  api.delete(`/encuestas/preguntas/${id}`);

// Encuestas
export const crearEncuesta = (data) =>
  api.post('/encuestas', data);

export const obtenerEncuestas = () =>
  api.get('/encuestas');

// Grupos (ajustar endpoint si es necesario)
export const obtenerGrupos = () =>
  api.get('/grupos');

 export const editarPregunta = (id, texto) =>
    api.put(`/encuestas/preguntas/${id}`, { texto });

export default api;
