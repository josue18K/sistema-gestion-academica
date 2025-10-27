import api from './api';

export const carreraService = {
  getAll: async () => {
    const response = await api.get('/carreras');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/carreras/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/carreras', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/carreras/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/carreras/${id}`);
    return response.data;
  },
};
