import api from './api';

export const inscripcionService = {
  getAll: async () => {
    const response = await api.get('/inscripciones');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/inscripciones/${id}`);
    return response.data;
  },

  getByEstudiante: async (estudianteId) => {
    const response = await api.get(`/inscripciones/estudiante/${estudianteId}`);
    return response.data;
  },

  getByGrupo: async (grupoId) => {
    const response = await api.get(`/inscripciones/grupo/${grupoId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/inscripciones', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/inscripciones/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/inscripciones/${id}`);
    return response.data;
  },
};
