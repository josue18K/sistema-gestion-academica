import api from './api';

export const materiaService = {
  getAll: async () => {
    const response = await api.get('/materias');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/materias/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/materias', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/materias/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/materias/${id}`);
    return response.data;
  },
};
