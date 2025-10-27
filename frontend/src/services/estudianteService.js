import api from './api';

export const estudianteService = {
  getAll: async () => {
    const response = await api.get('/estudiantes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/estudiantes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/estudiantes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/estudiantes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/estudiantes/${id}`);
    return response.data;
  },
};
