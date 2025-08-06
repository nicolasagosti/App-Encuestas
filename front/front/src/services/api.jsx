import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Añade token a todas las peticiones excepto al login y registro
api.interceptors.request.use(
  (config) => {
    if (
      config.url?.endsWith('/auth/login') ||
      config.url?.endsWith('/auth/register')
    ) {
      return config;
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export function login(payload) {
  return api.post('/auth/login', payload);
}
export function register(payload) {
  return api.post('/auth/register', payload);
}
export function cambiarPassword(newPassword) {
  return api.put('/auth/change-password', { newPassword });
}

// Preguntas
export function crearPregunta(texto) {
  return api.post('/encuestas/preguntas', { texto });
}
export function obtenerPreguntas() {
  return api.get('/encuestas/preguntas');
}
export function editarPregunta(id, texto) {
  return api.put(`/encuestas/preguntas/${id}`, { texto });
}
export function eliminarPregunta(id) {
  return api.delete(`/encuestas/preguntas/${id}`);
}

// Encuestas
export function crearEncuesta(data) {
  return api.post('/encuestas', data);
}
export function editarEncuesta(id, data) {
  return api.put(`/encuestas/${id}`, data);
}
export function obtenerEncuestas() {
  return api.get('/encuestas');
}

// Grupos
export function obtenerGrupos() {
  return api.get('/grupos');
}
export function agregarGrupo(data) {
  return api.post('/grupos', data);
}

// Clientes
export function cargarCliente() {
  return api.get('/clientes');
}

export function obtenerClientes() {
  return api.get('/clientes');
}
export function asignarGruposACliente(clienteId, idGrupos) {
  return api.post(`/clientes/${clienteId}/grupos`, idGrupos);
}

export function obtenerIdDeCliente(mailCliente) {
  return api.post('/clientes/id', { mailCliente });
}

export function asignarClientesAGrupo(grupoId, idClientes) {
  return api.post(`/clientes/${grupoId}`, idClientes);
}

// Encuestas de cliente y respuestas
export function obtenerEncuestasDeCliente(clienteId) {
  return api.get(`/clientes/${clienteId}/encuestas`);
}
export function responderEncuesta(clienteId, encuestaId, respuestas) {
  return api.post(
    `/clientes/${clienteId}/encuestas/${encuestaId}/respuestas`,
    respuestas
  );
}
export function debeCambiarPassword(email) {
  return api.get('/clientes/must-change-password', {
    params: { email: email.trim().toLowerCase() },
  });
}

//Estadisticas

export const obtenerPromedioGrupo = async (grupoId) => {
  return api.get(`/estadisticas/${grupoId}`);
};


export const obtenerEstadisticasGrupoPorPeriodo = (fechaInicio, fechaFin, tipo, valor) => {
  if (tipo === 'banco') {
    return api.get('/estadisticas/grupos/periodo/por-banco', {
      params: { fechaInicio, fechaFin, banco: valor }
    });
  }
  if (tipo === 'cliente') {
    return api.get('/estadisticas/grupos/periodo/por-cliente', {
      params: { fechaInicio, fechaFin, referente: valor }
    });
  }
  return api.get('/estadisticas/grupos/periodo', {
    params: { fechaInicio, fechaFin }
  });
};



// Clientes Bancos
export function cargarBanco(formData) {
  return api.post(
    '/api/banco/agregar',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
}

export function editarClienteParcial(clienteId, data) {
  return api.patch(`/clientes/${clienteId}`, data);
}

export function obtenerBanco(extension) {
  return api.get(`/api/banco/obtener/${extension}`);
}

export function obtenerBancos() {
  return api.get('/api/banco/todos');
}

export default api;
