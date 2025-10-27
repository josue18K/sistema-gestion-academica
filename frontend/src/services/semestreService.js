import api from './api';

export const semestreService = {
  getAll: async () => {
    const response = await api.get('/semestres');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/semestres/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/semestres', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/semestres/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/semestres/${id}`);
    return response.data;
  },
};
