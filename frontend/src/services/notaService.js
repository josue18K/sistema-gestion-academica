import api from './api';

export const notaService = {
  getAll: async () => {
    const response = await api.get('/notas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/notas/${id}`);
    return response.data;
  },

  getByInscripcion: async (inscripcionId) => {
    const response = await api.get(`/notas/inscripcion/${inscripcionId}`);
    return response.data;
  },

  getPromedio: async (inscripcionId) => {
    const response = await api.get(`/notas/promedio/${inscripcionId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/notas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/notas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notas/${id}`);
    return response.data;
  },
};
