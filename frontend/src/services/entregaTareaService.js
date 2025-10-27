import api from './api';

export const entregaTareaService = {
  getAll: async () => {
    const response = await api.get('/entregas-tareas');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/entregas-tareas/${id}`);
    return response.data;
  },

  getByTarea: async (tareaId) => {
    const response = await api.get(`/entregas-tareas/tarea/${tareaId}`);
    return response.data;
  },

  getByEstudiante: async (estudianteId) => {
    const response = await api.get(`/entregas-tareas/estudiante/${estudianteId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/entregas-tareas', data);
    return response.data;
  },

  calificar: async (id, data) => {
    const response = await api.post(`/entregas-tareas/${id}/calificar`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/entregas-tareas/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/entregas-tareas/${id}`);
    return response.data;
  },
};
