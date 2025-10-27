import api from './api';

export const asistenciaService = {
  getAll: async () => {
    const response = await api.get('/asistencias');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/asistencias/${id}`);
    return response.data;
  },

  getByInscripcion: async (inscripcionId) => {
    const response = await api.get(`/asistencias/inscripcion/${inscripcionId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/asistencias', data);
    return response.data;
  },

  registrarMasivo: async (data) => {
    const response = await api.post('/asistencias/masivo', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/asistencias/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/asistencias/${id}`);
    return response.data;
  },
};
