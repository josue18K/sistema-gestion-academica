import api from './api';

export const docenteService = {
  getAll: async () => {
    const response = await api.get('/docentes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/docentes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/docentes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/docentes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/docentes/${id}`);
    return response.data;
  },
};
