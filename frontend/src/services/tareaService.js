import api from './api';

export const tareaService = {
  getAll: async () => {
    const response = await api.get('/tareas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tareas/${id}`);
    return response.data;
  },

  getByGrupo: async (grupoId) => {
    const response = await api.get(`/tareas/grupo/${grupoId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/tareas', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/tareas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tareas/${id}`);
    return response.data;
  },
};
